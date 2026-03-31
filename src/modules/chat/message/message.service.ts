import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from './message.dto';
import { MessageEntity } from './message.entity';
import { Repository } from 'typeorm';
import { ChatRoomService } from 'src/modules/chat/chat-room/chat-room.service';
import { WsException } from '@nestjs/websockets';
import { socketErrorResponse } from 'src/common/helpers';
import { SenderTypeEnum } from 'src/common/enums';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>,
        private readonly chatRoomService: ChatRoomService,
    ) {}

    async sendMessage(
        senderId: string,
        senderType: SenderTypeEnum,
        dto: SendMessageDto,
    ) {
        const chatRoom = await this.chatRoomService.get(dto.chatRoomId);
        if (!chatRoom) {
            throw new WsException(
                socketErrorResponse(
                    'Chat room not found',
                    HttpStatus.NOT_FOUND,
                ),
            );
        }

        const message = this.messageRepo.create({
            chatRoomId: dto.chatRoomId,
            senderId,
            senderType,
            content: dto.content,
        });
        if (dto.replyToId) {
            message.replyToId;
        }

        return await this.messageRepo.save(message);
    }
}
