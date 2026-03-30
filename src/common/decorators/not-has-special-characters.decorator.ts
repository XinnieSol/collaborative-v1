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
export function NotHasSpecialCharacters(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'NotHasSpecialCharacters',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: NotHasSpecialCharactersRule,
        });
    };
}

@ValidatorConstraint({ name: 'NotHasSpecialCharacters', async: true })
@Injectable()
export class NotHasSpecialCharactersRule implements ValidatorConstraintInterface {
    constructor() {}

    async validate(value: string) {
        const validStringRegex =
            /^[A-Za-zÀ-ÿ]+(?:['-][A-Za-zÀ-ÿ]+)*(?: [A-Za-zÀ-ÿ]+(?:['-][A-Za-zÀ-ÿ]+)*)*$/;
        return typeof value === 'string' && validStringRegex.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} The length of the password must be at least 8 characters long. The Password must contain at least one letter from the alphabet, at least one upper case, must should contain at least one number and, at least one of: !@#$%^&*`;
    }
}
