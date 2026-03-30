/**
 * @property PENDING user has not verified email
 * @property ACTIVE user has verfied email
 * @property SUSPENDED user account has been suspended
 * @property DELETED user account deleted by choice
 */
export enum AccountStatusEnum {
    PENDING = 'pending',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    DELETED = 'deleted',
}

export enum AuthChannelEnum {
    BASIC = 'basic',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
}
