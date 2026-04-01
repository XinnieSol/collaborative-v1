import { StringValueInUnits } from 'src/common/types';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface GoogleConfig {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
}

const schema = Joi.object<GoogleConfig>({
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    callbackUrl: Joi.string().required(),
});

export const getConfig = (): GoogleConfig => {
    return {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_AUTH_CALLBACK_URL || '',
    };
};

export default registerAs('google', (): GoogleConfig => {
    const config = getConfig();
    Joi.assert(config, schema, `Validalidation failed for google`);
    return config;
});
