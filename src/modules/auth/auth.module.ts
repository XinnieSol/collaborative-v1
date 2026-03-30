import { Module } from '@nestjs/common';
import { LoginModule } from 'src/modules/auth/login';
import { RegisterModule } from 'src/modules/auth/register';

@Module({
    imports: [RegisterModule, LoginModule],
})
export class AuthModule {}
