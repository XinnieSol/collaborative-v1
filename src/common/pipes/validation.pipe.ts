import { Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import type { Type, ValidationError } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { validationExceptionsFactory } from 'src/common/utils';

export class HttpValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => validationExceptionsFactory(errors),
        });
    }
}

@Injectable()
export class WsValidationPipe<T extends object = any> implements PipeTransform {
    constructor(private readonly dto?: Type<T>) {}

    transform(value: any) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch {
                throw new WsException('Invalid JSON payload');
            }
        }

        const payload = value.data ?? value;

        if (!this.dto) return payload;

        const object = plainToInstance(this.dto, payload);

        const errors: ValidationError[] = validateSync(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        validationExceptionsFactory(errors, 'ws');

        return object;
    }
}
