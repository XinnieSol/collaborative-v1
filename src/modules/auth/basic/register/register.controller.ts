import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import { RegisterService } from './register.service';
import { HttpSuccessReponse } from 'src/common/types';
import { successReponse } from 'src/common/helpers';
import { AppHttpException } from 'src/common/exceptions';

@Controller('')
export class RegisterController {
    private readonly logger = new Logger(
        `[BasicAuth] ${RegisterController.name}`,
    );
    constructor(private readonly registerService: RegisterService) {}

    @Post('register')
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
}
