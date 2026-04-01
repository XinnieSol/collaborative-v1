import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { now } from 'moment';
import { AccountStatusEnum } from 'src/common/enums';
import { AppHttpException } from 'src/common/exceptions';
import { RequestInterface } from 'src/common/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    canActivate(context: ExecutionContext): boolean {
        try {
            const request: Partial<RequestInterface> = context
                .switchToHttp()
                .getRequest();

            const { user, authError, auth } = request;

            if (authError) {
                this.logger.log(authError);
                throw authError;
            }

            if (!auth?.token) {
                throw new HttpException(
                    'Missing access token',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const tokenExpiry = auth?.expiresAt;

            if (!user?.id || !tokenExpiry) {
                this.logger.error(`Unauthorized: Incomplete enrichment`);

                throw new HttpException(
                    'Invalid token supplied',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (now() / 1000 >= tokenExpiry) {
                throw new HttpException(
                    'Access token expired',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (user.accountStatus !== AccountStatusEnum.ACTIVE) {
                throw new HttpException(
                    'Account is not active',
                    HttpStatus.FORBIDDEN,
                );
            }

            return true;
        } catch (error) {
            console.log(error);
            this.logger.error(error.message);
            throw new AppHttpException(error);
        }
    }
}
