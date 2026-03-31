import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppWsException } from 'src/common/exceptions';
import { WsExceptionsFilter } from 'src/common/filters';
import { ClientInterface } from 'src/common/interfaces';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    allowEIO3: true,
})
@UsePipes(ValidationPipe)
@UseFilters(WsExceptionsFilter)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
    private readonly logger = new Logger(ChatGateway.name);

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        this.logger.log(`Gateway Initialized`);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        // new SocketAuthGuard();
        // get connected user chat rooms and join
        this.logger.log(`New user connected|Client: ${client.id}`);
    }

    handleDisconnect(client: ClientInterface) {
        try {
            this.logger.log(
                `Client disconnected: ${client.id}|${client.handshake.auth.phoneNumber}`,
            );
            // set last seen date
        } catch (error) {
            this.logger.error(
                `Error handling disconnect|REASON:${error.message}`,
                error.stack,
            );
            throw new AppWsException(error);
        }
    }
}
