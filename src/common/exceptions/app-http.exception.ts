import { HttpException } from '@nestjs/common';

export class AppHttpException extends HttpException {
    constructor(error) {
        error = error.error ?? error;
        super(
            error.status == 500 || !error.status
                ? 'An unexpected error occured'
                : error.message,
            error.status,
        );
    }
}
