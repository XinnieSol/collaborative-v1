import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { ChatRoomEntity, ChatRoomModule } from 'src/modules/chat/chat-room';
import { MessageService } from 'src/modules/chat/message/message.service';
import { MessageGateway } from 'src/modules/chat/message/message.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([MessageEntity, ChatRoomEntity]),
        ChatRoomModule,
    ],
    providers: [MessageService, MessageGateway],
    exports: [MessageService],
})
export class MessageModule {}
