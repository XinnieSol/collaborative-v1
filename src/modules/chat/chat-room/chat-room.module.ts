import { Module } from '@nestjs/common';
import { ChatRoomMemberModule } from './chat-room-member/chat-room-member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './chat-room.entity';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomMemberEntity } from './chat-room-member/chat-room-member.entity';
import { ChatRoomGateway } from './chat-room.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomEntity, ChatRoomMemberEntity]),
        ChatRoomMemberModule,
    ],
    controllers: [ChatRoomController],
    providers: [ChatRoomService, ChatRoomGateway],
    exports: [ChatRoomService, ChatRoomGateway],
})
export class ChatRoomModule {}
