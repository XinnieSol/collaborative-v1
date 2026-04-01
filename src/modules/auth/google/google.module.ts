import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleConfig } from 'src/common/config/google.config';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user';
import { GoogleService } from 'src/modules/auth/google/google.service';

const googleProvider: Provider = {
    provide: 'GOOGLE',
    useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<GoogleConfig>('google');
        return {
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            callbackUrl: config.callbackUrl,
        };
    },
    inject: [ConfigService],
};

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [GoogleController],
    providers: [googleProvider, GoogleStrategy, GoogleService],
    exports: [googleProvider, GoogleStrategy, GoogleService],
})
export class GoogleModule {}
