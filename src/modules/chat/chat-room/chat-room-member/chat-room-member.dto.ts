import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/common/dto';
import { ChatRoomMemberEntity } from './chat-room-member.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChatRoomMemberResponse extends AbstractDto {
    @ApiResponseProperty()
    chatRoomId: string;

    @ApiResponseProperty()
    userId: string;

    constructor(entity: ChatRoomMemberEntity) {
        super(entity);
    }
}

export class AddMemberDto {
    @ApiProperty({
        type: String,
        name: 'chatRoomId',
        example: 'uuid',
    })
    @IsNotEmpty()
    @IsUUID('4', { each: true, message: 'Invlid chat room' })
    chatRoomId: string;

    @ApiProperty({
        type: String,
        name: 'userId',
        example: 'uuid',
    })
    @IsNotEmpty()
    @IsUUID('4', { each: true, message: 'Invalid user' })
    userId: string;
}
