export enum SenderTypeEnum {
    HUMAN = 'human',
    AI = 'ai',
}

export enum MessageStatusEnum {
    PENDING = 'pending',
    SENT = 'sent',
}

export enum MessagePatternEnum {
    USER_SEND_MESSAGE = 'userSendMessage',
    USER_NEW_MESSAGE = 'userNewMessage',
    AI_SEND_MESSAGE = 'aiSendMessage',
    JOIN_ROOM = 'joinRoom',
    JOINED_ROOM = 'joinedRoom',
    EXCEPTION = 'exception',
}
