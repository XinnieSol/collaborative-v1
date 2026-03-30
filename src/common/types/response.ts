import { ApiResponseProperty } from '@nestjs/swagger';

export type AppOkResponse = {
    success: boolean;
    message: string;
    data: any;
};

export interface ResponseDto {
    success: boolean;
    message: string;
    data?: any;
    meta?: any;
    status?: string;
}

export class HttpSuccessReponse {
    @ApiResponseProperty({ example: true })
    success: boolean;
    @ApiResponseProperty({ example: 'successful' })
    message: string;
    @ApiResponseProperty()
    data?: any;
    @ApiResponseProperty({ example: 200 })
    status: number;
    path?: string;
}
