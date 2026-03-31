import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AbstractDto } from 'src/common/dto';
import { MessageEntity } from 'src/modules/chat/message/message.entity';

export class MessageResponse extends AbstractDto {
    @ApiResponseProperty()
    chatRoomId: string;

    @ApiResponseProperty()
    senderId: string;

    @ApiResponseProperty()
    replyingTo: string;

    @ApiResponseProperty()
    content: string;

    constructor(entity: MessageEntity) {
        super(entity);
    }
}

export class SendMessageDto {
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
        name: 'replyToId',
        example: 'uuid',
    })
    @IsOptional()
    @IsUUID('4', { each: true, message: 'Invlid message id' })
    replyToId?: string;

    @ApiProperty({
        type: String,
        name: 'content',
        required: true,
        example: 'Hi',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    content: string;
}
