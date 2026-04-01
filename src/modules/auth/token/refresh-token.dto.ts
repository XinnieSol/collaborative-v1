import { AbstractDto } from 'src/common/dto';
import { AccountStatusEnum } from 'src/common/enums';
import { RefreshTokenEntity } from 'src/modules/auth/token/refresh-token.entity';

export class RefreshTokenResponse extends AbstractDto {
    userId: string;
    token: string;
    expiresAt: Date;

    constructor(entity: RefreshTokenEntity) {
        super(entity);
    }
}

export type AccessTokenData = {
    userId: string;
    fullname: string;
    email: string;
    accountStatus: AccountStatusEnum;
    exp?: number;
};
