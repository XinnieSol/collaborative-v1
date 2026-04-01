import { BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

export interface Error {
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

export class WsValidationException extends WsException {
    constructor(public validationErrors: BadRequestError[]) {
        super(validationErrors);
    }
}
