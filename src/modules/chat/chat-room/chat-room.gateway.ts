import { Logger, UseGuards } from '@nestjs/common';
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
import { WsAuthGuard } from 'src/common/guards';
import type { ClientInterface } from 'src/common/interfaces';
import { joinRoom } from 'src/common/utils';
import { ChatRoomService } from './chat-room.service';
import { successReponse } from 'src/common/helpers';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
export class ChatRoomGateway {
    private readonly logger = new Logger(ChatRoomGateway.name);
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatRoomService: ChatRoomService) {}

    @SubscribeMessage(MessagePatternEnum.JOIN_ROOM)
    async joinRoom(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody() data: { chatRoomId: string },
    ) {
        this.logger.log(
            `Sucessfully recieved ${MessagePatternEnum.JOINED_ROOM}|Data: ${JSON.stringify(data)}`,
        );
        try {
            joinRoom(client, data.chatRoomId);
            client.emit(
                MessagePatternEnum.JOINED_ROOM,
                successReponse('Joined successfully'),
            );
        } catch (error) {
            this.logger.error(
                `Error handling ${MessagePatternEnum.JOINED_ROOM}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }

    @SubscribeMessage(MessagePatternEnum.FETCH_ROOMS)
    async fetchRooms(@ConnectedSocket() client: ClientInterface) {
        try {
            const rooms = await this.chatRoomService.fetchAll(client.user.id);
            if (rooms.length) {
                rooms.map((room) => {
                    joinRoom(client, room.id);
                });
            }
            client.emit(
                MessagePatternEnum.FETCHED_ROOMS,
                successReponse('Rooms fetched', rooms),
            );
        } catch (error) {
            this.logger.error(
                `Error handling ${MessagePatternEnum.FETCH_ROOMS}|REASON: ${error?.message}`,
            );
            throw new AppWsException(error);
        }
    }
}
