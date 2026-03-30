import { Module } from '@nestjs/common';
import { ChatRoomMemberModule } from './chat-room-member/chat-room-member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from 'src/modules/chat/chat-room/chat-room.entity';
import { ChatRoomController } from 'src/modules/chat/chat-room/chat-room.controller';
import { ChatRoomService } from 'src/modules/chat/chat-room/chat-room.service';
import { ChatRoomMemberEntity } from './chat-room-member/chat-room-member.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomEntity, ChatRoomMemberEntity]),
        ChatRoomMemberModule,
    ],
    controllers: [ChatRoomController],
    providers: [ChatRoomService],
    exports: [ChatRoomService],
})
export class ChatRoomModule {}
