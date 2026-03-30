import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthConfig } from 'src/common/config/auth.config';

const TOKEN = 'JWT';
const jwtProvider: Provider = {
    provide: TOKEN,
    useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<AuthConfig>('auth');
        return {
            secret: config.accessTokenSecret,
            signOptions: {
                expiresIn: config.accessTokenExpiry,
            },
        };
    },
    inject: [ConfigService],
};

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [TOKEN],
            useFactory: (authConfig: AuthConfig) => {
                return {
                    secret: authConfig.accessTokenSecret,
                    signOptions: {
                        expiresIn: authConfig.accessTokenExpiry,
                    },
                };
            },
        }),
    ],
    providers: [jwtProvider, JwtService],
    exports: [jwtProvider, JwtService],
})
export class JwtCustomModule {}
