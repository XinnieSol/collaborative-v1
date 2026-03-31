import { Socket } from 'socket.io';
import { AccountStatusEnum } from 'src/common/enums';
import { AppWsException } from 'src/common/exceptions';

export interface ClientInterface extends Socket {
    user: {
        id: string;
        accountStatus: AccountStatusEnum;
    };
    auth: {
        token: string;
        expiresAt?: number;
    };
    authError: AppWsException;
}
