import { ValidationPipe } from '@nestjs/common';
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
