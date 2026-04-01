import { BaseAbstractEntity } from 'src/common/types';
import { ChatRoomEntity } from 'src/modules/chat/chat-room';
import { ConversationSummaryResponse } from 'src/modules/chat/message/message.dto';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('conversation_summaries')
export class ConversationSummary extends BaseAbstractEntity<ConversationSummaryResponse> {
    @Column({ type: 'uuid' })
    chatRoomId: string;

    @ManyToOne(() => ChatRoomEntity)
    chatRoom: ChatRoomEntity;

    @Column('varchar')
    summary: string;

    dtoClass = ConversationSummaryResponse;
}
