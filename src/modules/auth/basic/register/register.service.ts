import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './register.dto';
import { UserEntity } from 'src/modules/user';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomNumeric } from 'src/common/utils';
import { AuthChannelEnum, CacheKeyEnum } from 'src/common/enums';
import { RedisService } from 'src/modules/redis';
import { hashString } from 'src/common/helpers/hash.helper';

export class RegisterService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly redisService: RedisService,
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

        // send email
    }
}
