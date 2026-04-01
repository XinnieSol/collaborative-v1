import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { AppHttpException } from 'src/common/exceptions';
import { GoogleService } from './google.service';

@ApiTags('OAuth: Google')
@Controller('auth/google')
export class GoogleController {
    private readonly logger = new Logger(GoogleController.name);
    constructor(private readonly googleService: GoogleService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    @ApiOAuth2(['email', 'profile'])
    async googleAuth(@Request() req) {
        this.logger.log('Google authentication initiated');
    }

    @Get('callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Request() req) {
        this.logger.log(
            `Google authentication validation initiated|Data ${JSON.stringify(req.user)}`,
        );
        try {
            const result = await this.googleService.validateLogin(req.user);
            this.logger.log(
                `Google authentication validation successful| Data ${JSON.stringify(req.user)}`,
            );
            return result;
        } catch (error) {
            this.logger.error(
                `Google authentication validation failed|REASON: ${error?.message}|Data ${JSON.stringify(req.user)}`,
            );
            throw new AppHttpException(error);
        }
    }
}
