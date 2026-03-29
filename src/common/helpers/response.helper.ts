import { HttpStatus } from '@nestjs/common';
import { HttpSuccessReponse } from 'src/common/types';

export function successReponse(
    message: string,
    data?: any,
    status?: number,
): HttpSuccessReponse {
    return { success: true, message, status: status || HttpStatus.OK, data };
}
