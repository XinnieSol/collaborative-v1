import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { TokenModule } from 'src/modules/auth/token/token.module';
import { UserEntity } from 'src/modules/user';
import { LoginController } from './login.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
    providers: [LoginService],
    controllers: [LoginController],
    exports: [LoginService],
})
export class LoginModule {}
