import {
    BadRequestException,
    ExecutionContext,
    HttpStatus,
    ValidationError,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { WsValidationException } from 'src/common/exceptions';
import { socketErrorResponse } from 'src/common/helpers';

const groupValidationErrors = (
    errors: ValidationError[],
    parentPath = '',
): { field: string; messages: string[] }[] => {
    const map = new Map<string, string[]>();

    const flatten = (errs: ValidationError[], prefix: string) => {
        for (const error of errs) {
            const path = prefix
                ? error.property.match(/^\d+$/)
                    ? `${prefix}[${error.property}]`
                    : `${prefix}.${error.property}`
                : error.property;

            if (error.constraints) {
                const existing = map.get(path) || [];
                const messages = Object.values(error.constraints);
                map.set(path, [...existing, ...messages]);
            }

            if (error.children?.length) {
                flatten(error.children, path);
            }
        }
    };

    flatten(errors, parentPath);

    return Array.from(map.entries()).map(([field, messages]) => ({
        field,
        messages,
    }));
};

export const validationExceptionsFactory = (
    errors: ValidationError[],
    context?: ExecutionContext,
) => {
    const groupedErrors = groupValidationErrors(errors);

    if (context?.getType() === 'ws') {
        throw new WsValidationException(groupedErrors);
    }
    throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: groupedErrors,
    });
};
