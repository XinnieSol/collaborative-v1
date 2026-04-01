import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { isJWT } from 'class-validator';
import { now } from 'moment';
import { MessagePatternEnum } from 'src/common/enums';
import { AppWsException } from 'src/common/exceptions';
import { socketErrorResponse } from 'src/common/helpers';
import { ClientInterface } from 'src/common/interfaces';
import { TokenService } from 'src/modules/auth/token/token.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
    private readonly logger = new Logger(WsAuthGuard.name);
    constructor(private tokenService: TokenService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: ClientInterface = context
            .switchToWs()
            .getClient<ClientInterface>();

        const token = this.getToken(
            client?.handshake?.headers['authorization'] || '',
        );

        if (!token || !isJWT(token)) {
            throw new WsException(
                socketErrorResponse(
                    'Invalid/missing access token',
                    HttpStatus.UNAUTHORIZED,
                ),
            );
        }

        try {
            const payload = this.tokenService.verifyAccessToken(token);

            const data = this.tokenService.verifyAccessToken(token);
            if (!data || !data.userId || !data.exp) {
                throw new WsException(
                    socketErrorResponse(
                        'Access token is missing',
                        HttpStatus.UNAUTHORIZED,
                    ),
                );
            }
            if (now() / 1000 >= data.exp) {
                throw new WsException(
                    socketErrorResponse(
                        'Access token expired',
                        HttpStatus.UNAUTHORIZED,
                    ),
                );
            }

            client.user = {
                id: data.userId,
                accountStatus: data.accountStatus,
            };

            client.auth = { token, expiresAt: data.exp };

            return true;
        } catch (error) {
            if (error.name == TokenExpiredError.name) {
                error = {
                    error: {
                        message: error?.message || 'Unknown error',
                        status: HttpStatus.UNAUTHORIZED,
                    },
                };
            }
            this.logger.error(`Error verify auth|REASON: ${error?.message}`);
            throw new AppWsException(error);
        }
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
