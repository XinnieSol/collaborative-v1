import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfig } from 'src/common/config/auth.config';
import { JwtCustomModule } from 'src/modules/auth/jwt/jwt.module';
import { RefreshTokenEntity } from 'src/modules/auth/token/refresh-token.entity';
import { TokenService } from 'src/modules/auth/token/token.service';

export const authProvider: Provider = {
    provide: 'AUTH',
    useFactory: (configService: ConfigService) => {
        const config: AuthConfig = configService.getOrThrow<AuthConfig>('auth');
        return config;
    },
    inject: [ConfigService],
};

@Module({
    imports: [TypeOrmModule.forFeature([RefreshTokenEntity]), JwtCustomModule],
    providers: [TokenService, authProvider],
    exports: [TokenService],
})
export class TokenModule {}
