import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagePatternEnum, SenderTypeEnum } from 'src/common/enums';
import { AppWsException } from 'src/common/exceptions';
import { WsExceptionsFilter } from 'src/common/filters';
import type { ClientInterface } from 'src/common/interfaces';
import { emitToRoom } from 'src/common/utils';
import { SendMessageDto } from 'src/modules/chat/message/message.dto';
import { MessageService } from 'src/modules/chat/message/message.service';

@WebSocketGateway({ cors: true })
@UsePipes(ValidationPipe)
@UseFilters(WsExceptionsFilter)
export class MessageGateway {
    private readonly logger = new Logger(MessageGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(private messageService: MessageService) {}

    @SubscribeMessage(MessagePatternEnum.USER_SEND_MESSAGE)
    async handleMessage(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody() data: SendMessageDto,
    ) {
        try {
            const message = await this.messageService.sendMessage(
                client.user.id,
                SenderTypeEnum.HUMAN,
                data,
            );
            emitToRoom(
                this.server,
                data.chatRoomId,
                MessagePatternEnum.USER_NEW_MESSAGE,
                message,
            );

            if (data.content.includes('@ai')) {
            }
        } catch (error) {
            this.logger.error(
                `Error handling ${MessagePatternEnum.USER_SEND_MESSAGE}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }
}
