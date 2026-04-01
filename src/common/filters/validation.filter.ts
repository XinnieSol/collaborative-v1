import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagePatternEnum } from 'src/common/enums';
import {
    ValidationException,
    WsValidationException,
} from 'src/common/exceptions';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): any {
        const context = host.switchToHttp();
        const errors = exception.validationErrors;
        const extraMessage = errors.length ? errors[0]?.message : '';

        return new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            errors: extraMessage,
        });
    }
}

@Catch(WsValidationException)
export class WsValidationFilter extends BaseWsExceptionFilter {
    catch(exception: WsValidationException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient() as Socket;
        const data = host.switchToWs().getData();
        const errors = exception.validationErrors;

        const extraMessage = errors.length ? errors[0]?.messages : '';

        client.emit(MessagePatternEnum.EXCEPTION, extraMessage);

        return;
    }
}
