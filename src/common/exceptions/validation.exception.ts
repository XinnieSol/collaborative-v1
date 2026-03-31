import { BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

interface Error {
    error: string;
    message: string;
}

export class ValidationException extends BadRequestException {
    constructor(public validationErrors: Error[]) {
        super();
    }
}

interface BadRequestError {
    field: string;
    messages: String[];
}

export class WsValidationException extends BaseWsExceptionFilter {
    constructor(public validationErrors: BadRequestError[]) {
        super();
    }
}
