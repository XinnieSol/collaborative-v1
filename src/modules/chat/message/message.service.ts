import {
    ContextType,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    EditMessageDto,
    FetchMessagesDto,
    SendMessageDto,
} from './message.dto';
import { MessageEntity } from './message.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ChatRoomService } from 'src/modules/chat/chat-room/chat-room.service';
import { WsException } from '@nestjs/websockets';
import { socketErrorResponse } from 'src/common/helpers';
import {
    MessagePatternEnum,
    MessageStatusEnum,
    SenderTypeEnum,
} from 'src/common/enums';
import { OpenAIService } from 'src/modules/open-ai/open-ai.service';
import { Server } from 'socket.io';
import { emitToRoom } from 'src/common/utils';
import { ConversationSummary } from './conversation-summary.entity';
import { MessageRoleEnum } from 'src/modules/open-ai/open-ai.enum';
import { ConversationalMessageDto } from 'src/modules/open-ai/open-ai.dto';
import { PageDto } from 'src/common/dto/pagination';
import { ChatRoomMemberService } from 'src/modules/chat/chat-room/chat-room-member/chat-room-member.service';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name);
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>,
        private readonly chatRoomService: ChatRoomService,
        private readonly openAiService: OpenAIService,
        @InjectRepository(ConversationSummary)
        private readonly conversationSummaryRepo: Repository<ConversationSummary>,
        private readonly chatRoomMemberService: ChatRoomMemberService,
    ) {}

    async sendMessage(senderId: string, dto: SendMessageDto, server: Server) {
        const chatRoom = await this.chatRoomService.get(dto.chatRoomId);
        if (!chatRoom) {
            throw new WsException(
                socketErrorResponse(
                    'Chat room not found',
                    HttpStatus.NOT_FOUND,
                ),
            );
        }

        let message = this.messageRepo.create({
            chatRoomId: dto.chatRoomId,
            senderId,
            senderType: SenderTypeEnum.HUMAN,
            content: dto.content,
        });
        if (dto.replyToId) {
            message.replyToId;
        }

        message = await this.messageRepo.save(message);

        emitToRoom(
            server,
            dto.chatRoomId,
            MessagePatternEnum.NEW_MESSAGE,
            message,
        );

        if (dto.content.includes('@ai')) {
            emitToRoom(
                server,
                dto.chatRoomId,
                MessagePatternEnum.AI_THINKING,
                {},
            );

            // no await this should be asynchronous for more perfomance
            this.handleAiMention(message.id, dto, server);
        }
    }

    async handleAiMention(
        replyToId: string,
        dto: SendMessageDto,
        server: Server,
    ) {
        try {
            const summary = await this.summarizeConversation(dto.chatRoomId);

            if (!summary) {
                return;
            }

            let aiResponse: string;

            if (summary == '') {
                aiResponse =
                    await this.openAiService.generateConversationalResponse([
                        {
                            role: MessageRoleEnum.USER,
                            content: dto.content.replace('@ai', ''),
                        },
                    ]);
            }

            aiResponse =
                await this.openAiService.generateConversationalResponse([
                    { role: MessageRoleEnum.USER, content: summary },
                    {
                        role: MessageRoleEnum.USER,
                        content: dto.content.replace('@ai', ''),
                    },
                ]);

            if (aiResponse) {
                let aiMessage = this.messageRepo.create({
                    chatRoomId: dto.chatRoomId,
                    replyToId,
                    senderType: SenderTypeEnum.AI,
                    content: dto.content,
                });

                aiMessage = await this.messageRepo.save(aiMessage);

                emitToRoom(
                    server,
                    dto.chatRoomId,
                    MessagePatternEnum.NEW_MESSAGE,
                    aiMessage,
                );
            }
        } catch (error) {
            this.logger.error(
                `Failed to get AI response|REASON ${error?.message}`,
            );
        }
    }

    async summarizeConversation(chatRoomId: string) {
        const lastTwentyMessages = await this.messageRepo.find({
            where: { chatRoomId },
            order: { createdAt: 'DESC' },
            take: 20,
        });

        if (!lastTwentyMessages.length) {
            this.logger.warn(
                `Nothing to summarize for now for chat room: ${chatRoomId}`,
            );
            return '';
        }

        const history: ConversationalMessageDto[] = lastTwentyMessages
            .reverse()
            .map((message) => ({
                role: MessageRoleEnum.USER,
                content: message.content,
            }));

        const aiResponse =
            await this.openAiService.generateConversationalResponse([
                {
                    role: MessageRoleEnum.SYSTEM,
                    content:
                        'Summarize this conversations into a concise paragraph.',
                },
                ...history,
            ]);

        await this.conversationSummaryRepo.upsert(
            { chatRoomId, summary: aiResponse },
            { conflictPaths: ['chatRoomId'] },
        );

        return aiResponse;
    }

    async fetchMessages(
        userId: string,
        dto: FetchMessagesDto,
        contextType?: ContextType,
    ) {
        const isMember = await this.chatRoomMemberService.getMemberUser(
            dto.chatRoomId,
            userId,
        );
        if (!isMember) {
            if (contextType == 'ws') {
                throw new WsException(
                    socketErrorResponse(
                        'You do not have access to this chat room',
                        HttpStatus.FORBIDDEN,
                    ),
                );
            }
            throw new HttpException(
                'You do not have access to this chat room',
                HttpStatus.FORBIDDEN,
            );
        }
        await this.deliverMessages(dto.chatRoomId);

        const { page, pageSize, skip, searchTerm } = dto;

        let query = this.messageRepo
            .createQueryBuilder('message')
            .leftJoin('message.sender', 'sender')
            .leftJoin('message.replyTo', 'replyTo')
            .where('message.chatRoomId = :chatRoomId', {
                chatRoomId: dto.chatRoomId,
            });
        if (searchTerm) {
            query.andWhere('message.content ILIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
            });
        }

        const [data, total] = await query
            .select([
                'message.id',
                'sender.id',
                'sender.firstName',
                'sender.lastName',
                'message.content',
                'message.status',
                'message.createdAt',
                'message.updatedAt',
                'replyTo.id',
                'replyTo.content',
            ])
            .orderBy({ 'message.createdAt': 'DESC' })
            .getManyAndCount();
        return new PageDto(data, total, { page, pageSize, skip, searchTerm });
    }

    async editMessage(userId: string, dto: EditMessageDto) {
        const message = await this.messageRepo.findOne({
            where: { id: dto.messageId, senderId: userId },
        });

        if (!message) {
            throw new WsException(
                socketErrorResponse('Message not found', HttpStatus.NOT_FOUND),
            );
        }

        await this.messageRepo.update(
            { id: dto.messageId },
            { content: dto.content, status: MessageStatusEnum.EDITTED },
        );

        return {
            senderId: userId,
            chatRoomId: message.chatRoomId,
            content: dto.content,
            updatedAt: new Date().toUTCString(),
        };
    }

    async deliverMessages(chatRoomId: string) {
        await this.messageRepo.update(
            {
                chatRoomId,
                status: MessageStatusEnum.PENDING,
            },
            { status: MessageStatusEnum.SENT },
        );
    }
}
