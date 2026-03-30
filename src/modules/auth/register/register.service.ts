import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto, ResendCodeDto, VerifyEmailDto } from './register.dto';
import { UserEntity } from 'src/modules/user';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomNumeric } from 'src/common/utils';
import {
    AccountStatusEnum,
    AuthChannelEnum,
    CacheKeyEnum,
} from 'src/common/enums';
import { RedisService } from 'src/modules/redis';
import { hashString } from 'src/common/helpers/hash.helper';
import { TokenService } from 'src/modules/auth/token/token.service';

export class RegisterService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly redisService: RedisService,
        private readonly tokenService: TokenService,
    ) {}

    async register(dto: RegisterDto) {
        let user = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (user) {
            throw new HttpException(
                'Email already in use',
                HttpStatus.BAD_REQUEST,
            );
        }

        const password = await hashString(dto.password);

        user = this.userRepo.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password,
            authChannel: AuthChannelEnum.BASIC,
        });

        await this.userRepo.save(user);

        const code = randomNumeric(6);
        const cacheKey = `${CacheKeyEnum.REGISTER}_${dto.email}`;
        await this.redisService.set(cacheKey, code, 600); // 10mins

        //TO DO: send email
        return { ...dto, code }; // code returne since no email service has been set yet. For test purposes sinf
    }

    async resendCode(dto: ResendCodeDto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (!user) {
            throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
        }

        const code = randomNumeric(6);
        const cacheKey = `${CacheKeyEnum.REGISTER}_${dto.email}`;
        await this.redisService.set(cacheKey, code, 600); // 10mins

        // resend email
    }

    async verifyEmail(dto: VerifyEmailDto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (!user) {
            throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
        }

        if (user.accountStatus !== AccountStatusEnum.PENDING) {
            throw new HttpException(
                'Account already verified',
                HttpStatus.CONFLICT,
            );
        }

        const cacheKey = `${CacheKeyEnum.REGISTER}_${dto.email}`;
        const cachedCode = await this.redisService.get(cacheKey);

        if (cachedCode !== dto.code) {
            throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
        }

        await this.userRepo.update(
            { id: user.id },
            { accountStatus: AccountStatusEnum.ACTIVE },
        );

        return {
            jwt: this.tokenService.generateAccessToken(user),
            ...(await this.tokenService.generateRefreshToken({
                userId: user.id,
            })),
        };
    }
}
