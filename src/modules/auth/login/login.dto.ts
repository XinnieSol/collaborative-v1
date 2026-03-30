import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsvalidPassword } from 'src/common/decorators';
import { HttpSuccessReponse } from 'src/common/types';

export class LoginDto {
    @ApiProperty({
        type: String,
        required: true,
        name: 'email',
        example: 'johndoe@mailsac.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @ApiProperty({
        type: String,
        name: 'password',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsvalidPassword({ message: 'Incorrect email or password' })
    password: string;
}

export class LoginReponseData {
    @ApiProperty()
    jwt: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    expiresAt: number;
}

export class LoginReponse extends HttpSuccessReponse {
    @ApiResponseProperty({
        example: {
            jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0OGE5YWRmZi03ZjQ2LTRmOGEtOWI5Yy1mNmY1ZTMwMGE2MGIiLCJmdWxsbmFtZSI6ImpvaG4gam9obiIsImVtYWlsIjoianVkZWRvZUBtYWlsc2FjLmNvbSIsImFjY291bnRTdGF0dXMiOiJwZW5kaW5nIiwiaWF0IjoxNzc0ODgxOTk3LCJleHAiOjE3NzQ4ODU1OTd9.jsMajavx2MdZ0arhtLrn2fsVaDX1n08agIHs_60NI0Y',
            refreshToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0OGE5YWRmZi03ZjQ2LTRmOGEtOWI5Yy1mNmY1ZTMwMGE2MGIiLCJpYXQiOjE3NzQ4ODE5OTcsImV4cCI6MTc3NDk2ODM5N30.5BAjjLLV_wbClsDJ8C12KTtBMsM3vruybPklIB4SDrU',
            expiresAt: 1774881997,
        },
    })
    declare data: LoginReponseData;
}

export class ForgotPasswordDto {
    @ApiProperty({
        type: String,
        required: true,
        name: 'email',
        example: 'johndoe@mailsac.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;
}
