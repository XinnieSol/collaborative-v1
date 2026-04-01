import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagePatternEnum } from 'src/common/enums';

@Catch(WsException)
export class WebSocketExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient() as Socket;

        const error = exception.getError() as {
            message: string;
            status: number;
        };
        client.emit(MessagePatternEnum.EXCEPTION, error);

        if (error?.status == HttpStatus.UNAUTHORIZED) {
            client.disconnect(true);
        }
        return;
    }
}
