import { Module } from '@nestjs/common';
import { ChatRoomModule } from 'src/modules/chat/chat-room';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { MessageModule } from 'src/modules/chat/message';

@Module({
    imports: [ChatRoomModule, MessageModule],
    providers: [ChatGateway],
})
export class ChatModule {}
