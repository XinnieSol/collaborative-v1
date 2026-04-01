import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from './message.dto';
import { MessageEntity } from './message.entity';
import { Repository } from 'typeorm';
import { ChatRoomService } from 'src/modules/chat/chat-room/chat-room.service';
import { WsException } from '@nestjs/websockets';
import { socketErrorResponse } from 'src/common/helpers';
import { MessagePatternEnum, SenderTypeEnum } from 'src/common/enums';
import { OpenAIService } from 'src/modules/open-ai/open-ai.service';
import { Server } from 'socket.io';
import { emitToRoom } from 'src/common/utils';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name);
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>,
        private readonly chatRoomService: ChatRoomService,
        private readonly openAiService: OpenAIService,
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
            try {
                const aiResponse = await this.openAiService.generateResponse(
                    dto.content.replace('@ai', ''),
                );
                if (aiResponse) {
                    let aiMessage = this.messageRepo.create({
                        chatRoomId: dto.chatRoomId,
                        replyToId: message.id,
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
        return message;
    }

    async summarizeMessages(chatRoomId: string) {
        const lastTwentyMessages = await this.messageRepo.find({});
    }
}
