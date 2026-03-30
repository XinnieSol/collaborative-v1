import { AccountStatusEnum, AuthChannelEnum } from 'src/common/enums';
import { BaseAbstractEntity } from 'src/common/types';
import { UserResponse } from 'src/modules/user/user.dto';
import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';

@Entity('users')
@Index(['email', 'firstName', 'lastName', 'userName', 'accountStatus'])
export class UserEntity extends BaseAbstractEntity<UserResponse> {
    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    firstName: string;

    @Column({ type: 'varchar', nullable: true })
    lastName: string;

    @Column({ type: 'varchar', nullable: true })
    userName: string;

    @Column()
    authChannel: AuthChannelEnum;

    @Column({ default: AccountStatusEnum.PENDING })
    accountStatus: AccountStatusEnum;

    @Column({ type: 'timestamptz', nullable: true })
    lastSeen: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    dtoClass = UserResponse;
}
