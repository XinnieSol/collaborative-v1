import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/common/dto';
import { AccountStatusEnum, AuthChannelEnum } from 'src/common/enums';
import { UserEntity } from 'src/modules/user';

export class UserDto {
    firstName: string;

    lastName: string;

    userName: string;

    email: string;

    password: string;

    acountStatus: AccountStatusEnum;

    authChannel: AuthChannelEnum;

    lastSeen: Date;
}

export class UserResponse extends AbstractDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    accountStatus: AccountStatusEnum;

    @ApiProperty()
    lastSeen: Date;

    constructor(entity: UserEntity) {
        super(entity);

        this.id = entity.id;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.userName = entity.userName;
        this.email = entity.email;
        this.accountStatus = entity.accountStatus;
        this.createdAt = entity.createdAt;
    }
}
