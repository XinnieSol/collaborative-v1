import { Logger } from '@nestjs/common';
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
import type { ClientInterface } from 'src/common/interfaces';
import { joinRoom } from 'src/common/utils';

@WebSocketGateway({ cors: true })
export class MessageGateway {
    private readonly logger = new Logger(MessageGateway.name);
    @WebSocketServer()
    server: Server;

    @SubscribeMessage(MessagePatternEnum.JOIN_ROOM)
    async handleMessage(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody() data: { chatRoomId: string },
    ) {
        try {
            joinRoom(client, data.chatRoomId);
        } catch (error) {
            this.logger.error(
                `Error handling ${MessagePatternEnum.JOINED_ROOM}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }
}
