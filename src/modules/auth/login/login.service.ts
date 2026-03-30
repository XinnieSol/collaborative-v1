import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ForgotPasswordDto, LoginDto, LoginReponseData } from './login.dto';
import { TokenService } from 'src/modules/auth/token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user';
import { Repository } from 'typeorm';
import { compareHashString } from 'src/common/helpers';
import { AccountStatusEnum, CacheKeyEnum } from 'src/common/enums';
import { randomNumeric } from 'src/common/utils';
import { RedisService } from 'src/modules/redis';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private readonly tokenService: TokenService,
        private readonly redisService: RedisService,
    ) {}

    async login(dto: LoginDto): Promise<LoginReponseData> {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
        });

        const errorMessage = 'Incorrect email or password';

        if (!user) {
            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }

        switch (user.accountStatus) {
            case AccountStatusEnum.PENDING: {
                throw new HttpException(
                    'Account is not active. You will recieve an email with next steps',
                    HttpStatus.FORBIDDEN,
                );
            }
            case AccountStatusEnum.SUSPENDED: {
                throw new HttpException(
                    `Account has been ${AccountStatusEnum.SUSPENDED}. Please, contact support`,
                    HttpStatus.FORBIDDEN,
                );
            }
            case AccountStatusEnum.DELETED: {
                // not the best case/solution
                throw new HttpException(
                    `Invalid account`,
                    HttpStatus.FORBIDDEN,
                );
            }

            default:
                break;
        }

        if (!(await compareHashString(dto.password, user.password))) {
            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }

        return {
            jwt: this.tokenService.generateAccessToken(user),
            ...(await this.tokenService.generateRefreshToken({
                userId: user.id,
            })),
        };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (!user) {
            throw new HttpException(
                'If account with email exists, you will recieve an email with next steps',
                HttpStatus.BAD_REQUEST,
            );
        }

        const code = randomNumeric(6);
        const cacheKey = `${CacheKeyEnum.FORGOT_PASSWORD}_${dto.email}`;
        await this.redisService.set(cacheKey, code, 600); // 10mins

        // resend email
    }

    async resetPassword() {}
}
