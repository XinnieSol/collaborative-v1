import { MessageStatusEnum, SenderTypeEnum } from 'src/common/enums';
import { BaseAbstractEntity } from 'src/common/types';
import { ChatRoomEntity } from 'src/modules/chat/chat-room';
import { MessageResponse } from 'src/modules/chat/message/message.dto';
import { UserEntity } from 'src/modules/user';
import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity('messages')
export class MessageEntity extends BaseAbstractEntity<MessageResponse> {
    @Column('uuid')
    chatRoomId: string;

    @ManyToOne(() => ChatRoomEntity)
    chatRoom: ChatRoomEntity;

    @Column({ type: 'uuid', nullable: true })
    senderId: string;

    @ManyToOne(() => UserEntity)
    sender: UserEntity;

    @Column({ type: 'uuid', nullable: true })
    replyToId: string;

    @ManyToOne(() => MessageEntity)
    replyTo: MessageEntity;

    @Column()
    content: string;

    @Column({ enum: SenderTypeEnum })
    senderType: SenderTypeEnum;

    @Column({ enum: MessageStatusEnum, default: MessageStatusEnum.PENDING })
    status: MessageStatusEnum;

    @DeleteDateColumn()
    deletedAt: Date;

    dtoClass = MessageResponse;
}
