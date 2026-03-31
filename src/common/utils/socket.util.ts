import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { ROOM } from 'src/common/constants';
import { MessagePatternEnum } from 'src/common/enums';

export function emitToRoom(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    roomId: string,
    messagePattern: MessagePatternEnum,
    message: any,
) {
    server.to(`${ROOM}_${roomId}`).emit(messagePattern, message);
}

export function joinRoom(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    roomId: string,
) {
    client.join(`${ROOM}_${roomId}`);
    client.emit(MessagePatternEnum.JOINED_ROOM, { roomId });
}
