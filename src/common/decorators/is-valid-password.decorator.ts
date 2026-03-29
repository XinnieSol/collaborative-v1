import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Ensures string do not have special characters
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
        const validStringRegex =
            /^(?=.*?[A-ZÀ-ÿ])(?=.*?[a-zÀ-ÿ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return typeof value === 'string' && validStringRegex.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid ${args.property} without special characters`;
    }
}
