import { Logger, UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { WsAuthGuard } from 'src/common/guards';
import type { ClientInterface } from 'src/common/interfaces';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
export class ChatRoomMemberGateway {
    // private readonly logger = new Logger(ChatRoomMemberGateway.name);
    // @WebSocketServer()
    // server: Server;
    // constructor(private readonly chatRoomMemberService: ChatRoomMemberService) {}
    // @SubscribeMessage(MessagePatternEnum.JOIN_ROOM)
    // async joinRoom(
    //     @ConnectedSocket() client: ClientInterface,
    //     @MessageBody() data: { chatRoomId: string },
    // ) {
    //     try {
    //         joinRoom(client, data.chatRoomId);
    //     } catch (error) {
    //         this.logger.error(
    //             `Error handling ${MessagePatternEnum.JOINED_ROOM}|REASON: ${error?.message}`,
    //         );
    //         throw new AppWsException(error);
    //     }
    // }
}
