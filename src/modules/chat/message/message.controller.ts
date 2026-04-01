import {
    Controller,
    Get,
    Logger,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppHttpException } from 'src/common/exceptions';
import { AuthGuard } from 'src/common/guards';
import type { RequestInterface } from 'src/common/interfaces';
import { MessageService } from './message.service';
import { successReponse } from 'src/common/helpers';
import {
    FetchMessagesDto,
    FetchMessagesResponse,
} from 'src/modules/chat/message/message.dto';

@ApiTags('Messages')
@Controller('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class MessageController {
    private readonly logger = new Logger(MessageController.name);
    constructor(private readonly messageService: MessageService) {}

    @Get()
    @ApiOkResponse({ type: FetchMessagesResponse })
    async fetchMessages(
        @Request() req: RequestInterface,
        @Query() query: FetchMessagesDto,
    ) {
        try {
            const result = await this.messageService.fetchMessages(
                req.user.id,
                query,
            );
            return successReponse('Messages fetched', result);
        } catch (error) {
            this.logger.error(
                `Error fetching messages|REASON: ${error?.message}`,
            );
            throw new AppHttpException(error);
        }
    }
}
