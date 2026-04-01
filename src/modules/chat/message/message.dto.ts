import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AbstractDto } from 'src/common/dto';
import { PageOptionsDto } from 'src/common/dto/pagination';
import { SenderTypeEnum } from 'src/common/enums';
import { HttpSuccessReponse } from 'src/common/types';
import { MessageEntity } from 'src/modules/chat/message/message.entity';
import { UserEntity } from 'src/modules/user';

export class MessageResponse extends AbstractDto {
    @ApiResponseProperty()
    chatRoomId: string;

    @ApiResponseProperty()
    senderId: string;

    @ApiResponseProperty()
    replyingTo: Partial<MessageEntity>;

    @ApiResponseProperty()
    content: string;

    @ApiResponseProperty()
    status: string;

    @ApiResponseProperty()
    sender: Partial<UserEntity>;

    @ApiResponseProperty()
    senderType: SenderTypeEnum;

    constructor(entity: MessageEntity) {
        super(entity);

        ((this.chatRoomId = entity.chatRoomId), (this.id = entity.id));
        this.content = entity.content;
        this.sender = entity.sender;
        this.replyingTo = entity.replyTo;
        this.createdAt = entity.createdAt;
        this.createdAt = entity.updatedAt;
        this.status = entity.status;
        if (entity.senderType === SenderTypeEnum.AI) {
            this.senderType = entity.senderType;
        }
    }
}

export class FetchMessagesResponse extends HttpSuccessReponse {
    @ApiResponseProperty({
        example: {
            data: {
                data: [
                    {
                        id: '827935ea-60a5-4069-b18f-b8ec4d3cf9d4',
                        createdAt: '2026-04-01T07:08:04.934Z',
                        replyingTo: null,
                        content: '@ai what is db transaction?',
                        status: 'sent',
                        sender: {
                            id: '48a9adff-7f46-4f8a-9b9c-f6f5e300a60b',
                            firstName: 'john',
                            lastName: 'john',
                        },
                    },
                    {
                        id: 'c077f833-5a85-4f99-9ea0-2989a2fa7e97',
                        createdAt: '2026-04-01T07:08:04.934Z',
                        replyingTo: null,
                        content: 'what is db transaction?',
                        status: 'sent',
                        sender: {
                            id: '48a9adff-7f46-4f8a-9b9c-f6f5e300a60b',
                            firstName: 'john',
                            lastName: 'john',
                        },
                    },
                ],
                meta: {
                    page: 1,
                    pageSize: 20,
                    itemCount: 2,
                    pageCount: 1,
                    hasPreviousPage: false,
                    hasNextPage: false,
                },
            },
        },
    })
    declare data: MessageResponse[];
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

export class ConversationSummaryResponse extends AbstractDto {
    chatRoomId: string;

    summary: string;

    constructor(entity: MessageEntity) {
        super(entity);
    }
}

export class EditMessageDto {
    @ApiProperty({
        type: String,
        name: 'messageId',
        example: 'uuid',
    })
    @IsOptional()
    @IsUUID('4', { each: true, message: 'Invlid message id' })
    messageId?: string;

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

export class FetchMessagesDto extends PageOptionsDto {
    @ApiProperty({
        type: String,
        name: 'chatRoomId',
        example: 'uuid',
    })
    @IsNotEmpty()
    @IsUUID('4', { each: true, message: 'Invlid chat room' })
    chatRoomId: string;
}
