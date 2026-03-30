import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import {
    IsvalidPassword,
    Match,
    NotHasSpecialCharacters,
} from 'src/common/decorators';

export class RegisterDto {
    @ApiProperty({
        type: String,
        name: 'firstName',
        required: true,
        example: 'John',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    @Length(2, 15, { message: 'Invalid first name' })
    @NotHasSpecialCharacters({
        message: 'first name must not contain special character',
    })
    firstName: string;

    @ApiProperty({
        type: String,
        required: true,
        name: 'lastName',
        example: 'John',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    @Length(2, 15, { message: 'Invalid last name' })
    @NotHasSpecialCharacters({
        message: 'Last name must not contain special character',
    })
    lastName: string;

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
        example: 'John123*',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsvalidPassword()
    password: string;

    @ApiProperty({
        type: String,
        name: 'confirmPassword',
        required: true,
        example: 'John123*',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    @Match('password')
    confirmPassword: string;
}

export class ResendCodeDto {
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

export class VerifyEmailDto {
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
        name: 'code',
        required: true,
        example: '000000',
    })
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    @IsString()
    @Length(6, 6, { message: 'Invalid code' })
    code: string;
}
