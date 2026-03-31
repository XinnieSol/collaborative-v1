import { WsException } from '@nestjs/websockets';
import { socketErrorResponse, SocketResponse } from 'src/common/helpers';

export class AppWsException extends WsException {
    constructor(exception: { error: SocketResponse }) {
        const error = exception.error;
        super(
            socketErrorResponse(
                error.status == 500 || !error.status
                    ? 'An unexpected error occured'
                    : error.message,
                error.status || 500,
            ),
        );
    }
}
