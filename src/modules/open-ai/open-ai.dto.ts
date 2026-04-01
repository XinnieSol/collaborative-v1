import { MessageRoleEnum } from 'src/modules/open-ai/open-ai.enum';

export class ConversationalMessageDto {
    role: MessageRoleEnum;
    content: string;
}
