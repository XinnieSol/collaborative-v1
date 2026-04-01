export enum SenderTypeEnum {
    HUMAN = 'human',
    AI = 'ai',
}

export enum MessageStatusEnum {
    PENDING = 'pending',
    SENT = 'sent',
    EDITTED = 'editted',
}

export enum MessagePatternEnum {
    SEND_MESSAGE = 'sendMessage',
    NEW_MESSAGE = 'newMessage',
    PREVIOUS_MESSAGES = 'previousMessages',
    PREVIOUS_MESSAGES_FETCHED = 'previousMessagesFetched',

    JOIN_ROOM = 'joinRoom',
    FETCH_ROOMS = 'fetchRooms',
    FETCHED_ROOMS = 'fetchedRooms',
    JOINED_ROOM = 'joinedRoom',

    EXCEPTION = 'exception',
    ONLINE = 'online',

    AI_THINKING = 'aiThinking',

    TYPING = 'typing',
}
