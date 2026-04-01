import { HttpStatus } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { MessagePatternEnum } from 'src/common/enums';
import { AppWsException } from 'src/common/exceptions';
import { ClientInterface } from 'src/common/interfaces';
import { HttpSuccessReponse } from 'src/common/types';

export function successReponse(
    message: string,
    data?: any,
    status?: number,
): HttpSuccessReponse {
    return { success: true, message, status: status || HttpStatus.OK, data };
}

export interface SocketResponse {
    success: boolean;
    status: number;
    message: string;
    data?: any;
    errors?: any;
}

export const socketErrorResponse = (
    message: string,
    status: number,
    errors?: object,
): SocketResponse => {
    return {
        success: false,
        status,
        message,
        errors,
    };
};

export function handleErrorWithDisconnect(client: ClientInterface, error: any) {
    if (error.name == TokenExpiredError.name) {
        error = {
            error: {
                message: error?.message || 'Unknown error',
                status: HttpStatus.UNAUTHORIZED,
            },
        };
    }

    const formattedErr = new AppWsException(error).getError();
    client.emit(MessagePatternEnum.EXCEPTION, formattedErr);
    client.disconnect();

    throw new AppWsException(error);
}
