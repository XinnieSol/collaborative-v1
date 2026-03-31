import { HttpStatus } from '@nestjs/common';
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
