import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { CacheKeyEnum } from 'src/common/enums';
import { socketErrorResponse } from 'src/common/helpers';
import { RedisService } from 'src/modules/redis';

@Injectable()
export class WsThrottlerGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();

        const userId = client?.user?.id;
        const ip = client.handshake?.address;

        const identifier = userId || ip;

        const key = `${CacheKeyEnum.WS_THROTTLE}_${identifier}`;
        const limit = Number(this.configService.get('THROTTLER_TTL'));
        const ttl = Number(this.configService.get('THROTTLER_LIMIT'));

        const current = await this.redisService.get(key);

        if (current && Number(current) >= limit) {
            throw new WsException(
                socketErrorResponse('Too many requests', HttpStatus.FORBIDDEN),
            );
        }

        if (!current) {
            await this.redisService.set(key, 1, ttl);
        } else {
            await this.redisService.incr(key);
        }

        return true;
    }
}
