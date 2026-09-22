import { UserRoleEnum } from '@/users/schemas/user.schema';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenData {
  id: number;
  role: UserRoleEnum;
}
