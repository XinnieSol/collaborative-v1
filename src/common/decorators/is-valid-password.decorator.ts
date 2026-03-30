import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Ensures password is strong
 */
export function IsvalidPassword(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsvalidPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsvalidPasswordRule,
        });
    };
}

@ValidatorConstraint({ name: 'IsvalidPassword', async: true })
@Injectable()
export class IsvalidPasswordRule implements ValidatorConstraintInterface {
    constructor() {}

    async validate(value: string) {
        const regex =
            /^(?=.*?[A-ZÀ–Þ])(?=.*?[a-zà-ÿ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return regex.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'The length of the password must be at least 8 characters long\nThe Password must contain at least one letter from the alphabet\nThe password must contain at least one upper case\nThe password should contain numerical character\nThe password should contain at least one special character: !@#$%^&*';
    }
}
