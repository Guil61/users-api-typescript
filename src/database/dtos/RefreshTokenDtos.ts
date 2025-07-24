export interface RefreshTokenAttributes {
  id?: number;
  refreshToken: string;
  userId: number;
  expiresAt: Date;
}

export interface CreateRefreshTokenDto {
  id?: number;
  refreshToken: string;
  userId: number;
}
