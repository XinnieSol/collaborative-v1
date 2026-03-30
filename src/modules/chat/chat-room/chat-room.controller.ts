import {
    Body,
    Controller,
    HttpStatus,
    Logger,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpSuccessReponse } from 'src/common/types';
import { successReponse } from 'src/common/helpers';
import { AppHttpException } from 'src/common/exceptions';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from 'src/modules/chat/chat-room/chat-room.dto';
import type { RequestInterface } from 'src/common/interfaces';
import { AuthGuard } from 'src/common/guards';

@ApiTags('Chat Room (Channel/Team/Space) Management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chat-room')
export class ChatRoomController {
    private readonly logger = new Logger(ChatRoomController.name);
    constructor(private readonly chatRoomSrvice: ChatRoomService) {}

    @Post('create')
    async register(
        @Request() req: RequestInterface,
        @Body() body: CreateChatRoomDto,
    ): Promise<HttpSuccessReponse> {
        try {
            const result = await this.chatRoomSrvice.create(req.user.id, body);
            return successReponse(
                'Chat room created',
                result,
                HttpStatus.CREATED,
            );
        } catch (error) {
            this.logger.error(`Error creating room|REASON: ${error?.message}`);
            throw new AppHttpException(error);
        }
    }
}
