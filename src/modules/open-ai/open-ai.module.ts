import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiConfig } from 'src/common/config/open-ai.config';
import { OpenAIService } from 'src/modules/open-ai/open-ai.service';

export const OPENAI = 'OPENAI';
const openAIProvider: Provider = {
    provide: OPENAI,
    useFactory: (configService: ConfigService) => {
        const config = configService.get<OpenAiConfig>('openai');
        return config;
    },
    inject: [ConfigService],
};

@Module({
    providers: [OpenAIService, openAIProvider],
    exports: [OpenAIService, openAIProvider],
})
export class OpenAIModule {}
