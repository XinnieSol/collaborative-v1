import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface OpenAiConfig {
    appName: string;
    apiKey: string;
}

export const schema = Joi.object<OpenAiConfig>({
    appName: Joi.string().required(),
    apiKey: Joi.string().required(),
});

export const getConfig = (): OpenAiConfig => ({
    appName: process.env.OPEN_AI_APP_NAME || 'collaborative',
    apiKey: process.env.OPEN_AI_API_KEY || '',
});

export default registerAs('openai', (): OpenAiConfig => {
    const config = getConfig();

    Joi.assert(config, schema, 'Failed to validate OpenAI configs');
    return config;
});
