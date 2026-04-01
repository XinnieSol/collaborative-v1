import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterService } from './register.service';
import { UserEntity } from 'src/modules/user';
import { RegisterController } from './register.controller';
import { RedisModule } from 'src/modules/redis';
import { TokenModule } from 'src/modules/auth/token/token.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), RedisModule, TokenModule],
    controllers: [RegisterController],
    providers: [RegisterService],
    exports: [RegisterService],
})
export class RegisterModule {}
