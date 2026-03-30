import { ChatRoomInviteStatusEnum } from 'src/common/enums';

export class ChatRoomInviteResponse {
    email: string;

    inviteStatus: ChatRoomInviteStatusEnum;
}
