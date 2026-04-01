import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { ChatRoomEntity, ChatRoomModule } from 'src/modules/chat/chat-room';
import { MessageService } from 'src/modules/chat/message/message.service';
import { MessageGateway } from 'src/modules/chat/message/message.gateway';
import { OpenAIModule } from 'src/modules/open-ai/open-ai.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MessageEntity, ChatRoomEntity]),
        ChatRoomModule,
        OpenAIModule,
    ],
    providers: [MessageService, MessageGateway],
    exports: [MessageService],
})
export class MessageModule {}
