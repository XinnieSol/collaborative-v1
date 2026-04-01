import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagePatternEnum } from 'src/common/enums';
import { AppWsException } from 'src/common/exceptions';
import { WsValidationFilter } from 'src/common/filters';
import { WsAuthGuard } from 'src/common/guards';
import type { ClientInterface } from 'src/common/interfaces';
import { WsValidationPipe } from 'src/common/pipes';
import { emitToClient, emitToRoom, joinRoom } from 'src/common/utils';
import {
    EditMessageDto,
    FetchMessagesDto,
    SendMessageDto,
} from 'src/modules/chat/message/message.dto';
import { MessageService } from 'src/modules/chat/message/message.service';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
@UseFilters(new WsValidationFilter())
export class MessageGateway {
    private readonly logger = new Logger(MessageGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(private messageService: MessageService) {}

    @SubscribeMessage(MessagePatternEnum.SEND_MESSAGE)
    async sendMessage(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody(new WsValidationPipe(SendMessageDto)) data: SendMessageDto,
    ) {
        try {
            joinRoom(client, data.chatRoomId);

            await this.messageService.sendMessage(
                client.user.id,
                data,
                this.server,
            );
        } catch (error) {
            console.log(error);
            this.logger.error(
                `Error handling ${MessagePatternEnum.SEND_MESSAGE}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }

    @SubscribeMessage(MessagePatternEnum.SEND_MESSAGE)
    async editMessage(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody(new WsValidationPipe(EditMessageDto)) data: EditMessageDto,
    ) {
        try {
            const result = await this.messageService.editMessage(
                client.user.id,
                data,
            );

            emitToRoom(
                this.server,
                result.chatRoomId,
                MessagePatternEnum.NEW_MESSAGE,
                result,
            );
        } catch (error) {
            console.log(error);
            this.logger.error(
                `Error handling ${MessagePatternEnum.SEND_MESSAGE}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }

    @SubscribeMessage(MessagePatternEnum.PREVIOUS_MESSAGES)
    async fetchMessages(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody(new WsValidationPipe(FetchMessagesDto))
        data: FetchMessagesDto,
    ) {
        try {
            const result = await this.messageService.fetchMessages(
                client.user.id,
                data,
            );

            emitToClient(
                client,
                MessagePatternEnum.PREVIOUS_MESSAGES_FETCHED,
                result,
            );
        } catch (error) {
            console.log(error);
            this.logger.error(
                `Error handling ${MessagePatternEnum.PREVIOUS_MESSAGES}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }
}
