import { Role } from '@/prisma/generated/enums';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenData {
  id: number;
  role: Role;
}
