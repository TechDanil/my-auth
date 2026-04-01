export type TypeUserInfo = {
  id: string;
  avatar: string;
  name: string;
  email: string;
  provider: string;
  accessToken?: string | null;
  refreshToken?: string;
  expiresAt?: number;
};
