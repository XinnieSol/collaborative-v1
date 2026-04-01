export interface GenerateRefreshToken {
    userId: string;
}

export interface SaveRefreshToken {
    userId: string;
    token: string;
    expiresAt: Date;
}

export interface RefreshSignData {
    userId: string;
}
