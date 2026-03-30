import { BaseAbstractEntity } from 'src/common/types';
import { ChatRoomResponse } from './chat-room.dto';
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/modules/user';

@Entity('chat_rooms')
@Index(['creatorId', 'name'], { unique: true })
export class ChatRoomEntity extends BaseAbstractEntity<ChatRoomResponse> {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'uuid' })
    creatorId: string;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    @DeleteDateColumn()
    deletedAt: Date;

    dtoClass = ChatRoomResponse;
}
