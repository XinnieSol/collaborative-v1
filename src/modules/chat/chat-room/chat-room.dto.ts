import { AbstractDto } from 'src/common/dto';
import { ChatRoomEntity } from './chat-room.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { NotHasSpecialCharacters } from 'src/common/decorators';

export class ChatRoomResponse extends AbstractDto {
    name: string;

    constructor(entity: ChatRoomEntity) {
        super(entity);
        this.name = entity.name;
        this.createdAt = entity.createdAt;
    }
}

export class CreateChatRoomDto {
    @ApiProperty({
        type: String,
        name: 'name',
        required: true,
        example: 'backend',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    @Length(2, 15, { message: 'Invalid name' })
    @NotHasSpecialCharacters({
        message: 'Name must not contain special character',
    })
    name: string;
}
