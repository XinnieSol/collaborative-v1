import { HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { socketErrorResponse, SocketResponse } from 'src/common/helpers';

export class AppWsException extends WsException {
    constructor(exception: { error: SocketResponse }) {
        const error = exception.error;
        super(
            socketErrorResponse(
                !error?.status ||
                    error?.status == HttpStatus.INTERNAL_SERVER_ERROR ||
                    !error?.status
                    ? 'An unexpected error occured'
                    : error.message,
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
    }
}
