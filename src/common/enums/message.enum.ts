export enum SenderTypeEnum {
    HUMAN = 'human',
    AI = 'ai',
}

export enum MessageStatusEnum {
    PENDING = 'pending',
    SENT = 'sent',
}

export enum MessagePatternEnum {
    SEND_MESSAGE = 'sendMessage',
    NEW_MESSAGE = 'newMessage',

    JOIN_ROOM = 'joinRoom',
    FETCH_ROOMS = 'fetchRooms',
    FETCHED_ROOMS = 'fetchedRooms',

    JOINED_ROOM = 'joinedRoom',
    EXCEPTION = 'exception',
    ONLINE = 'online',
}
