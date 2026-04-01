import { BaseAbstractEntity } from 'src/common/types';
import { ChatRoomResponse } from './chat-room.dto';
import {
    Column,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/modules/user';
import { ChatRoomMemberEntity } from 'src/modules/chat/chat-room/chat-room-member/chat-room-member.entity';

@Entity('chat_rooms')
@Index(['creatorId', 'name'], { unique: true })
export class ChatRoomEntity extends BaseAbstractEntity<ChatRoomResponse> {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'uuid' })
    cr: string;

    @Column({ type: 'uuid' })
    creatorId: string;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(
        () => ChatRoomMemberEntity,
        (member: ChatRoomMemberEntity) => member.chatRoom,
    )
    members: ChatRoomMemberEntity[];

    dtoClass = ChatRoomResponse;
}
