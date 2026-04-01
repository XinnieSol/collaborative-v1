import { Global, Module, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import {
    ConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN,
} from './redis.module-definition';
import Redis, { RedisOptions } from 'ioredis';
import { RedisConfig } from 'src/common/config/redis.config';

const RedisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    useFactory: (configService: ConfigService) => {
        const config: RedisOptions =
            configService.getOrThrow<RedisConfig>('redis');

        return new Redis(config);
    },
    inject: [ConfigService],
};

@Global()
@Module({
    providers: [RedisProvider, RedisService],
    exports: [RedisProvider, RedisService],
})
export class RedisModule extends ConfigurableModuleClass {}
