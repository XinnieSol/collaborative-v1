import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/modules/auth/google/google.module';
import { LoginModule } from 'src/modules/auth/login';
import { RegisterModule } from 'src/modules/auth/register';

@Module({
    imports: [RegisterModule, LoginModule, GoogleModule],
})
export class AuthModule {}
