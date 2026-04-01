import { Request } from 'express';
import { AccountStatusEnum } from 'src/common/enums';
import { AppHttpException } from 'src/common/exceptions';

export interface RequestInterface extends Request {
    user: {
        id: string;
        accountStatus: AccountStatusEnum;
    };
    auth: {
        token: string;
        expiresAt?: number;
    };
    authError: AppHttpException;
}
