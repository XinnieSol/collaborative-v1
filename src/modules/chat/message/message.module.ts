import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { ChatRoomEntity, ChatRoomModule } from 'src/modules/chat/chat-room';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { OpenAIModule } from 'src/modules/open-ai/open-ai.module';
import { ConversationSummary } from './conversation-summary.entity';
import { ChatRoomMemberModule } from 'src/modules/chat/chat-room/chat-room-member/chat-room-member.module';
import { MessageController } from './message.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MessageEntity,
            ChatRoomEntity,
            ConversationSummary,
        ]),
        ChatRoomModule,
        OpenAIModule,
        ChatRoomMemberModule,
    ],
    controllers: [MessageController],
    providers: [MessageService, MessageGateway],
    exports: [MessageService],
})
export class MessageModule {}
