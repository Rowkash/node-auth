import { UserRoleEnum } from '@/users/schemas/user.schema';

export interface IUserSession {
  userId: number;
  userRole: UserRoleEnum;
  refreshToken: string;
  // ua: 'user-agent-info',
  // fingerprint: 'fingerprint-info',
  // ip: '192.168.0.1',
  expiresIn: number;
  createdAt: number;
}
