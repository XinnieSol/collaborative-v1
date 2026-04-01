import { registerAs } from '@nestjs/config';
import { LogLevel } from '@nestjs/common';
import Joi from 'joi';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const environments = ['development', 'staging', 'production'] as const;
const logLevels: readonly LogLevel[] = [
    'debug',
    'error',
    'log',
    'verbose',
    'warn',
];

type Environment = (typeof environments)[number];
export type AppConfig = {
    name: string;
    version: string;
    environment: Environment;
    server: {
        host: string;
        port: number;
    };
    swagger: {
        enabled: boolean;
    };
    log: {
        name: string;
        version: string;
        level: LogLevel;
    };
    throttler: {
        ttl: number;
        limit: number;
    };
};

const schema = Joi.object<AppConfig>({
    name: Joi.string().required(),
    version: Joi.string().min(5).required(),
    environment: Joi.string()
        .valid(...environments)
        .required(),
    server: Joi.object({
        port: Joi.number().integer().min(0).required(),
        host: Joi.string().min(5).required(),
    }),
    swagger: Joi.object({
        enabled: Joi.boolean().required(),
    }),
    log: Joi.object({
        name: Joi.string().required(),
        version: Joi.string().min(5).required(),
        level: Joi.string()
            .valid(...logLevels)
            .required(),
    }),
    throttler: Joi.object({
        ttl: Joi.number().integer().default('60'),
        limit: Joi.number().integer().default(10),
    }),
});

const getPackageInfo = () => {
    const content = readFileSync(
        path.join(process.cwd(), 'package.json'),
        'utf-8',
    );

    return JSON.parse(content) as { name: string; version: string };
};

export const getConfig = (): AppConfig => {
    const pkg = getPackageInfo();
    const name = process.env.APP_NAME || pkg.name;

    process.env.APP_NAME = name;

    const version = process.env.VERSION || pkg.version;
    const environment = (process.env.ENVIRONMENT ||
        process.env.NODE_ENV ||
        'development') as Environment;
    return {
        name,
        version,
        environment,
        server: {
            host: process.env.SERVER_HOST || process.env.HOST || '0.0.0.0',
            port: Number(process.env.SERVER_PORT || process.env.PORT || 8083),
        },
        swagger: {
            enabled:
                (process.env.SWAGGER_ENABLED || 'false')
                    .trim()
                    .toLowerCase() === 'true',
        },
        log: {
            name,
            version,
            level: (process.env.LOG_LEVEL || 'log') as LogLevel,
        },
        throttler: {
            ttl: Number(process.env.THROTTLER_TTL || 60),
            limit: Number(process.env.THROTTLER_LIMIT || 10),
        },
    };
};

export default registerAs('app', (): AppConfig => {
    const config = getConfig();
    Joi.assert(config, schema, `Validalidation failed for ${config.name}`);
    return config;
});
