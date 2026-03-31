import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { ROOM } from 'src/common/constants';
import { MessagePatternEnum } from 'src/common/enums';
import { ClientInterface } from 'src/common/interfaces';

export function emitToRoom(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    roomId: string,
    messagePattern: MessagePatternEnum,
    message: any,
) {
    server.to(`${ROOM}_${roomId}`).emit(messagePattern, message);
}

export function joinRoom(client: ClientInterface, roomId: string) {
    client.join(`${ROOM}_${roomId}`);
}
