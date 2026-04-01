import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { ROOM } from 'src/common/constants';
import { MessagePatternEnum } from 'src/common/enums';
import { ClientInterface } from 'src/common/interfaces';

export function emitToRoom(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    roomId: string,
    messagePattern: MessagePatternEnum,
    data?: any,
) {
    server.to(`${ROOM}_${roomId}`).emit(messagePattern, data);
}

export function joinRoom(client: ClientInterface, roomId: string) {
    client.join(`${ROOM}_${roomId}`);
    console.log(`Joined room: ${roomId}`);
}

export function emitToClient(
    client: ClientInterface,
    messagePattern: MessagePatternEnum,
    data: any,
) {
    client.emit(messagePattern, data);
}
