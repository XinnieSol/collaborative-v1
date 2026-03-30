import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { RegisterDto, ResendCodeDto, VerifyEmailDto } from './register.dto';
import { RegisterService } from './register.service';
import { HttpSuccessReponse } from 'src/common/types';
import { successReponse } from 'src/common/helpers';
import { AppHttpException } from 'src/common/exceptions';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Registration/Onboarding')
@Controller('register')
export class RegisterController {
    private readonly logger = new Logger(
        `[BasicAuth] ${RegisterController.name}`,
    );
    constructor(private readonly registerService: RegisterService) {}

    @Post('')
    async register(@Body() body: RegisterDto): Promise<HttpSuccessReponse> {
        try {
            const result = await this.registerService.register(body);
            return successReponse(
                'Registration successful. A code has been sent to your mail',
                result,
                HttpStatus.CREATED,
            );
        } catch (error) {
            this.logger.error(
                `Error registering user |REASON: ${error?.message}`,
            );
            throw new AppHttpException(error);
        }
    }

    @Post('resend-code')
    async resendCode(@Body() body: ResendCodeDto): Promise<HttpSuccessReponse> {
        try {
            const result = await this.registerService.resendCode(body);
            return successReponse('Code has been re-sent to your mail', result);
        } catch (error) {
            this.logger.error(
                `Error resending code |REASON: ${error?.message}`,
            );
            throw new AppHttpException(error);
        }
    }

    @Post('verify-email')
    async verifyEmail(
        @Body() body: VerifyEmailDto,
    ): Promise<HttpSuccessReponse> {
        try {
            const result = await this.registerService.verifyEmail(body);
            return successReponse('Verification successful', result);
        } catch (error) {
            this.logger.error(
                `Error verifying email |REASON: ${error?.message}`,
            );
            throw new AppHttpException(error);
        }
    }
}
