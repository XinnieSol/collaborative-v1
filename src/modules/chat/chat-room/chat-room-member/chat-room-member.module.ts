import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomMemberEntity } from './chat-room-member.entity';
import { UserEntity } from 'src/modules/user';
import { ChatRoomMemberController } from './chat-room-member.controller';
import { ChatRoomMemberService } from './chat-room-member.service';
import { ChatRoomEntity } from 'src/modules/chat/chat-room/chat-room.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            ChatRoomEntity,
            ChatRoomMemberEntity,
        ]),
    ],
    providers: [ChatRoomMemberService],
    controllers: [ChatRoomMemberController],
    exports: [ChatRoomMemberService],
})
export class ChatRoomMemberModule {}
