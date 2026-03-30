import { StringValueInUnits } from 'src/common/types';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface AuthConfig {
    accessTokenSecret: string;
    accessTokenExpiry: StringValueInUnits;
    refreshTokenSecret: string;
    refreshTokenExpiry: StringValueInUnits;
}

const schema = Joi.object<AuthConfig>({
    accessTokenSecret: Joi.string().required(),
    accessTokenExpiry: Joi.string().required(),
    refreshTokenSecret: Joi.string().required(),
    refreshTokenExpiry: Joi.string().required(),
});

export const getConfig = (): AuthConfig => {
    return {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
        accessTokenExpiry:
            (process.env.ACCESS_TOKEN_EXPIRY as StringValueInUnits) ||
            `${600}s`,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
        refreshTokenExpiry:
            (process.env.REFRESH_TOKEN_EXPIRY as StringValueInUnits) ||
            `${3600}s`,
    };
};

export default registerAs('auth', (): AuthConfig => {
    const config = getConfig();
    Joi.assert(config, schema, `Validalidation failed for auth`);
    return config;
});
