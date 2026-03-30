import { BaseAbstractEntity } from 'src/common/types';
import { RefreshTokenResponse } from 'src/modules/auth/token/refresh-token.dto';
import { Column, Entity } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseAbstractEntity<RefreshTokenResponse> {
    @Column({ type: 'uuid', unique: true })
    userId: string;

    @Column('varchar')
    token: string;

    @Column('timestamptz')
    expiresAt: Date;

    dtoClass = RefreshTokenResponse;
}
