import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import config from 'src/common/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DbConfig } from 'src/common/config/db.config';
import { SnakeCaseNamingStrategy } from 'src/common/utils';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthMiddleware } from 'src/common/middlewares';
import { ChatModule } from 'src/modules/chat/chat.module';
import { AppGateway } from 'src/app.gateway';
import { OpenAIModule } from 'src/modules/open-ai/open-ai.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [...config],
            expandVariables: false,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const configs = configService.get<DbConfig>(
                    'database',
                ) as TypeOrmModuleAsyncOptions;
                return {
                    ...configs,
                    namingStrategy: new SnakeCaseNamingStrategy(),
                    autoLoadEntities: true,
                    migrations: ['dist/migrations/*{.js}'],
                };
            },
            inject: [ConfigService],
        }),
        // ThrottlerModule.forRoot({
        //     // ttl: 60, // seconds
        //     limit: 10, // max requests per ttl
        // }),
        AuthModule,
        ChatModule,
        OpenAIModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude('/register/*path', '/login/*path')
            .forRoutes({ path: '*path', method: RequestMethod.ALL });
    }
}
