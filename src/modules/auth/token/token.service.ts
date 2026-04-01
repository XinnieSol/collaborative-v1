import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import type { AuthConfig } from 'src/common/config/auth.config';
import { StringValueInUnits } from 'src/common/types';
import { AccessTokenData } from './refresh-token.dto';
import { RefreshTokenEntity } from './refresh-token.entity';
import { UserEntity } from 'src/modules/user';
import { EntityManager, Repository } from 'typeorm';
import { GenerateRefreshToken, SaveRefreshToken } from './token.interface';
import { getExpiryDate } from 'src/common/utils';
import { compareHashString, hashString } from 'src/common/helpers';

@Injectable()
export class TokenService {
    private accessTokenSecret: string;
    private accessTokenExpiry: StringValueInUnits;
    private refreshTokenSecret: string;
    private refreshTokenExpiry: StringValueInUnits;

    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
        @Inject('AUTH')
        private readonly authConfig: AuthConfig,
        private readonly jwtService: JwtService,
    ) {
        this.accessTokenSecret = authConfig.accessTokenSecret;
        this.accessTokenExpiry = authConfig.accessTokenExpiry;
        this.refreshTokenSecret = authConfig.refreshTokenSecret;
        this.refreshTokenExpiry = authConfig.refreshTokenExpiry;
    }

    generateAccessToken(user: UserEntity) {
        const options: JwtSignOptions = {
            secret: this.accessTokenSecret,
            expiresIn: this.accessTokenExpiry,
        };

        const data: AccessTokenData = {
            userId: user.id,
            fullname: `${user.firstName} ${user.lastName}`,
            email: user?.email,
            accountStatus: user.accountStatus,
        };

        const token = this.jwtService.sign(data, options);

        return token;
    }

    async generateRefreshToken(
        data: GenerateRefreshToken,
    ): Promise<{ refreshToken: string; expiresAt: number }> {
        const options: JwtSignOptions = {
            secret: this.refreshTokenSecret,
            expiresIn: this.refreshTokenExpiry,
        };

        const token = this.jwtService.sign(
            {
                userId: data.userId,
            },
            options,
        );
        const expiresAt = getExpiryDate(new Date(), this.refreshTokenExpiry);
        await this.saveRefreshToken({
            userId: data.userId,
            token,
            expiresAt,
        });

        return {
            refreshToken: token,
            expiresAt: Math.floor(new Date(expiresAt).getTime() / 1000),
        };
    }

    private async saveRefreshToken(data: SaveRefreshToken): Promise<void> {
        const token = await hashString(data.token);
        await this.refreshTokenRepo.upsert(
            {
                userId: data.userId,
                token,
                expiresAt: data.expiresAt,
            },
            { conflictPaths: ['userId'] },
        );
    }

    verifyAccessToken(token: string): AccessTokenData {
        const options: JwtVerifyOptions = {
            secret: this.accessTokenSecret,
        };

        const payload: AccessTokenData = this.jwtService.verify(token, options);

        return payload;
    }

    async verifyRefreshToken(userId: string, token: string): Promise<boolean> {
        const refreshToken = await this.refreshTokenRepo.findOne({
            where: { userId },
        });
        return !refreshToken ||
            !(await compareHashString(token, refreshToken.token))
            ? false
            : true;
    }
}
