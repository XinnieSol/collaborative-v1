import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto, LoginReponse } from './login.dto';
import { HttpSuccessReponse } from 'src/common/types';
import { successReponse } from 'src/common/helpers';
import { AppHttpException } from 'src/common/exceptions';

@ApiTags('Login')
@Controller('login')
export class LoginController {
    private readonly logger = new Logger(LoginController.name);
    constructor(private readonly loginService: LoginService) {}

    @Post('')
    @ApiOkResponse({ type: LoginReponse })
    async login(@Body() body: LoginDto): Promise<HttpSuccessReponse> {
        try {
            const result = await this.loginService.login(body);
            return successReponse('Login successful', result);
        } catch (error) {
            this.logger.error(`Error log in user |REASON: ${error?.message}`);
            throw new AppHttpException(error);
        }
    }
}
