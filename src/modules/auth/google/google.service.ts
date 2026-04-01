import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatusEnum, AuthChannelEnum } from 'src/common/enums';
import { TokenService } from 'src/modules/auth/token/token.service';
import { UserEntity } from 'src/modules/user';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly tokenService: TokenService,
    ) {}

    async validateLogin(profile: any) {
        let user = await this.userRepo.findOne({
            where: { email: profile.email },
        });

        if (!user) {
            // Register new user
            const names = profile.name.split(' ');
            const firstName = names.length ? names[0] : profile.name;
            const lastName = names.length ? names[0] : profile.name;

            user = this.userRepo.create({
                email: profile.email,
                firstName,
                lastName,
                accountStatus: AccountStatusEnum.ACTIVE,
                authChannel: AuthChannelEnum.GOOGLE,
            });
            user = await this.userRepo.save(user);
        }

        return {
            jwt: this.tokenService.generateAccessToken(user),
            ...(await this.tokenService.generateRefreshToken({
                userId: user.id,
            })),
        };
    }
}
