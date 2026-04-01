import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RegisterService } from './register.service';
import { UserEntity } from 'src/modules/user';
import { RedisService } from 'src/modules/redis';
import { TokenService } from 'src/modules/auth/token/token.service';
import { HttpException } from '@nestjs/common';
import {
    AuthChannelEnum,
    AccountStatusEnum,
    CacheKeyEnum,
} from 'src/common/enums';
import { RegisterDto, ResendCodeDto, VerifyEmailDto } from './register.dto';
import * as hashHelper from 'src/common/helpers/hash.helper';
import * as utils from 'src/common/utils';

describe('RegisterService', () => {
    let service: RegisterService;
    let userRepo: Partial<Repository<UserEntity>>;
    let redisService: Partial<RedisService>;
    let tokenService: Partial<TokenService>;

    beforeEach(async () => {
        userRepo = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
        };

        redisService = {
            set: jest.fn(),
            get: jest.fn(),
        };

        tokenService = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterService,
                { provide: 'UserEntityRepository', useValue: userRepo },
                { provide: RedisService, useValue: redisService },
                { provide: TokenService, useValue: tokenService },
            ],
        }).compile();

        service = module.get<RegisterService>(RegisterService);

        // Patch InjectRepository manually
        (service as any).userRepo = userRepo;
    });

    describe('register', () => {
        it('should create a new user and return code', async () => {
            const dto: RegisterDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@test.com',
                password: 'pass123#',
                confirmPassword: 'pass123#',
            };
            (userRepo.findOne as jest.Mock).mockResolvedValue(null);
            jest.spyOn(hashHelper, 'hashString').mockResolvedValue(
                'hashed-pass',
            );
            (userRepo.create as jest.Mock).mockReturnValue({
                ...dto,
                password: 'hashed-pass',
                authChannel: AuthChannelEnum.BASIC,
            });
            (userRepo.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });
            jest.spyOn(utils, 'randomNumeric').mockReturnValue('123456');

            const result = await service.register(dto);

            expect(userRepo.findOne).toHaveBeenCalledWith({
                where: { email: dto.email },
            });
            expect(userRepo.create).toHaveBeenCalled();
            expect(userRepo.save).toHaveBeenCalled();
            expect(redisService.set).toHaveBeenCalledWith(
                `${CacheKeyEnum.REGISTER}_${dto.email}`,
                '123456',
                600,
            );
            expect(result.code).toBe('123456');
        });

        it('should throw error if email already exists', async () => {
            (userRepo.findOne as jest.Mock).mockResolvedValue({ id: 1 });

            await expect(service.register({} as RegisterDto)).rejects.toThrow(
                HttpException,
            );
        });
    });

    describe('resendCode', () => {
        it('should resend code if user exists', async () => {
            const dto: ResendCodeDto = { email: 'test@test.com' };
            (userRepo.findOne as jest.Mock).mockResolvedValue({ id: 1 });
            jest.spyOn(utils, 'randomNumeric').mockReturnValue('654321');

            await service.resendCode(dto);

            expect(redisService.set).toHaveBeenCalledWith(
                `${CacheKeyEnum.REGISTER}_${dto.email}`,
                '654321',
                600,
            );
        });

        it('should throw error if user does not exist', async () => {
            (userRepo.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                service.resendCode({ email: 'no@user.com' }),
            ).rejects.toThrow(HttpException);
        });
    });

    describe('verifyEmail', () => {
        it('should verify email and return tokens', async () => {
            const dto: VerifyEmailDto = {
                email: 'test@test.com',
                code: '123456',
            };
            const user = { id: 1, accountStatus: AccountStatusEnum.PENDING };
            (userRepo.findOne as jest.Mock).mockResolvedValue(user);
            (redisService.get as jest.Mock).mockResolvedValue('123456');
            (tokenService.generateAccessToken as jest.Mock).mockReturnValue(
                'jwt-token',
            );
            (tokenService.generateRefreshToken as jest.Mock).mockResolvedValue({
                refreshToken: 'refresh-token',
            });

            const result = await service.verifyEmail(dto);

            expect(userRepo.update).toHaveBeenCalledWith(
                { id: user.id },
                { accountStatus: AccountStatusEnum.ACTIVE },
            );
            expect(result.jwt).toBe('jwt-token');
            expect(result.refreshToken).toBe('refresh-token');
        });

        it('should throw error if user does not exist', async () => {
            (userRepo.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                service.verifyEmail({ email: 'none@test.com', code: '123' }),
            ).rejects.toThrow(HttpException);
        });

        it('should throw error if code is invalid', async () => {
            const user = { id: 1, accountStatus: AccountStatusEnum.PENDING };
            (userRepo.findOne as jest.Mock).mockResolvedValue(user);
            (redisService.get as jest.Mock).mockResolvedValue('000000');

            await expect(
                service.verifyEmail({ email: 'test@test.com', code: '123456' }),
            ).rejects.toThrow(HttpException);
        });

        it('should throw error if account already active', async () => {
            const user = { id: 1, accountStatus: AccountStatusEnum.ACTIVE };
            (userRepo.findOne as jest.Mock).mockResolvedValue(user);

            await expect(
                service.verifyEmail({ email: 'test@test.com', code: '123456' }),
            ).rejects.toThrow(HttpException);
        });
    });
});
