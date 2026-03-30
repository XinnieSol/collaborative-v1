import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AppHttpException } from 'src/common/exceptions';
import { RequestInterface } from 'src/common/interfaces';
import { TokenService } from 'src/modules/auth/token/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthMiddleware.name);
    constructor(private readonly tokenService: TokenService) {}

    async use(req: RequestInterface, res: any, next: (error?: any) => void) {
        try {
            this.logger.debug(`Auth middleware`);

            const authorization =
                req.headers['authorization'] || req.headers['Authorization'];

            if (!authorization) {
                this.logger.warn(
                    `No authorization supplied ${JSON.stringify(req.headers)}`,
                );
                return next();
            }

            const token = this.getToken(authorization as string);
            if (!token) {
                this.logger.warn(`No token supplied`);
                return next();
            }

            req.auth = { token };

            const path = req.path.split('/');

            if (!path.length || path[path.length - 1] == 'refresh') {
                this.logger.warn(`Skipping..because of ${req.path}`);
                return next();
            }

            const data = this.tokenService.verifyAccessToken(token);
            if (!data || !data.userId || !data.exp) {
                this.logger.warn(
                    `No userId and details in decoded: ${JSON.stringify(data)}`,
                );
                return next();
            }

            req.user = {
                id: data.userId,
                accountStatus: data.accountStatus,
            };

            req.auth = { ...req.auth, expiresAt: data.exp };
        } catch (error) {
            console.log(error);
            this.logger.error(`Error in middleware|REASON: ${error?.message}`);
            error = {
                message: 'Access token expired',
                status: HttpStatus.UNAUTHORIZED,
            };
            req.authError = new AppHttpException(error);
        }
        next();
    }

    private getToken(authorization: string) {
        const parts = authorization.split(' ');
        if (
            parts.length < 2 ||
            parts[0].toLowerCase() !== 'bearer' ||
            !parts[1]
        )
            return null;

        return parts[1];
    }
}
