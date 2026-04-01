import { Inject, Injectable, Logger } from '@nestjs/common';
import type { OpenAiConfig } from 'src/common/config/open-ai.config';
import OpenAI from 'openai';
import { ConversationalMessageDto } from 'src/modules/open-ai/open-ai.dto';

@Injectable()
export class OpenAIService {
    private readonly logger = new Logger(OpenAIService.name);

    private client: OpenAI;
    constructor(
        @Inject('OPENAI')
        private readonly openAiConfig: OpenAiConfig,
    ) {
        this.client = new OpenAI({ apiKey: openAiConfig.apiKey });
    }

    async generateResponse(prompt: string): Promise<string> {
        this.logger.log(`Attempting to generate response for prompt ${prompt}`);
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices?.[0]?.message?.content ?? '';
    }

    async generateConversationalResponse(
        messages: ConversationalMessageDto[],
    ): Promise<string> {
        this.logger.log(`Attempting to generate response for prompt ${prompt}`);
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [...messages],
        });

        return response.choices?.[0]?.message?.content ?? '';
    }
}
