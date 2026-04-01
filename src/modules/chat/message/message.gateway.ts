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
import { emitToRoom } from 'src/common/utils';
import { SendMessageDto } from 'src/modules/chat/message/message.dto';
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
    async handleMessage(
        @ConnectedSocket() client: ClientInterface,
        @MessageBody(new WsValidationPipe(SendMessageDto)) data: SendMessageDto,
    ) {
        try {
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
}
