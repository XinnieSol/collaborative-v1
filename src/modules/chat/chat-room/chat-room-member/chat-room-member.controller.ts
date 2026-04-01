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
import { ChatRoomMemberService } from './chat-room-member.service';
import { AddMemberDto } from 'src/modules/chat/chat-room/chat-room-member/chat-room-member.dto';
import { HttpSuccessReponse } from 'src/common/types';
import { successReponse } from 'src/common/helpers';
import { AppHttpException } from 'src/common/exceptions';
import type { RequestInterface } from 'src/common/interfaces';
import { AuthGuard } from 'src/common/guards';

@ApiTags('Chat Room (Channel/Team/Space): Members Management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chat-room/members')
export class ChatRoomMemberController {
    private readonly logger = new Logger(ChatRoomMemberController.name);
    constructor(private readonly chatRoomMemberSrvice: ChatRoomMemberService) {}

    @Post('add-member')
    async register(
        @Request() req: RequestInterface,
        @Body() body: AddMemberDto,
    ): Promise<HttpSuccessReponse> {
        try {
            const result = await this.chatRoomMemberSrvice.addMember(
                req.user.id,
                body,
            );
            return successReponse('Member added', result, HttpStatus.CREATED);
        } catch (error) {
            this.logger.error(`Error adding member|REASON: ${error?.message}`);
            throw new AppHttpException(error);
        }
    }
}
