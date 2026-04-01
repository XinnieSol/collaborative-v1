import {
    Logger,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppWsException } from 'src/common/exceptions';
import { WsValidationFilter } from 'src/common/filters';
import { WsAuthGuard } from 'src/common/guards';
import { ClientInterface } from 'src/common/interfaces';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    allowEIO3: true,
    namespace: '/chat',
})
@UseGuards(WsAuthGuard)
@UsePipes(ValidationPipe)
@UseFilters(WsValidationFilter)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
    private readonly logger = new Logger(ChatGateway.name);

    @WebSocketServer()
    server: Server;

    private onlineUsers: Map<string, string> = new Map();

    afterInit(server: Server) {
        this.logger.log(`Gateway Initialized`);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            // get connected user chat rooms and join
            this.logger.log(`New user connected|Client: ${client.id}`);
        } catch (error) {
            throw new AppWsException(error);
        }
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
