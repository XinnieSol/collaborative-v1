import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    async get(key: string): Promise<any> {
        let data = await this.redisClient.get(key);
        return data;
    }

    async set(key: string, value: any, ttl = 3600): Promise<any> {
        const data = JSON.stringify(value);
        await this.redisClient.set(key, value, 'EX', ttl, 'NX');
    }

    async incr(key: string): Promise<number> {
        return this.redisClient.incr(key);
    }
}
