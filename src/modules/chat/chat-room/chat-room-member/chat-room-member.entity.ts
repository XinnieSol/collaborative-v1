import { BaseAbstractEntity } from 'src/common/types';
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from 'typeorm';
import { ChatRoomMemberResponse } from './chat-room-member.dto';
import { ChatRoomEntity } from 'src/modules/chat/chat-room/chat-room.entity';
import { UserEntity } from 'src/modules/user';

@Entity('chat_room_members')
@Index(['chatRoomId', 'userId'], { unique: true })
export class ChatRoomMemberEntity extends BaseAbstractEntity<ChatRoomMemberResponse> {
    @Column({ type: 'uuid' })
    chatRoomId: string;

    @ManyToOne(() => ChatRoomEntity)
    chatRoom: ChatRoomEntity;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @DeleteDateColumn()
    deletedAt: Date;

    dtoClass = ChatRoomMemberResponse;
}
