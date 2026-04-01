import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiConfig } from 'src/common/config/open-ai.config';
import { OpenAIService } from 'src/modules/open-ai/open-ai.service';

const openAIProvider: Provider = {
    provide: 'OPENAI',
    useFactory: (configService: ConfigService) => {
        const config: OpenAiConfig = configService.getOrThrow('openai');
        return config;
    },
    inject: [ConfigService],
};

@Module({
    providers: [OpenAIService, openAIProvider],
    exports: [OpenAIService, openAIProvider],
})
export class OpenAIModule {}
