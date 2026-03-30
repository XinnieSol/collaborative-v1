import { Module } from '@nestjs/common';
import { ChatRoomModule } from 'src/modules/chat/chat-room';

@Module({
    imports: [ChatRoomModule],
})
export class ChatModule {}
