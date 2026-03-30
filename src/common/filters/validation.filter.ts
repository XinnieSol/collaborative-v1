import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { ValidationException } from 'src/common/exceptions';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): any {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const errors = exception.validationErrors;
        const extraMessage = errors.length ? errors[0]?.message : '';

        return new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            errors: extraMessage,
        });
    }
}
