import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
import Joi from 'joi';

export interface DbConfig {
    type: DatabaseType;
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
}

export const schema = Joi.object<DbConfig>({
    type: Joi.string().required(),
    database: Joi.string().min(2).required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    port: Joi.number().integer().min(0).required(),
    host: Joi.string().min(5).required(),
    logging: Joi.boolean().required(),
    synchronize: Joi.boolean().required(),
});

export const getConfig = (): DbConfig => ({
    type: (process.env.DB_TYPE || 'postgres') as DatabaseType,
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
});

export default registerAs('database', (): DbConfig => {
    const config = getConfig();

    Joi.assert(config, schema, 'Failed to validate databse configs');
    return config;
});
