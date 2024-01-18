export interface IUserSession {
  userId: string;
  refreshToken: string;
  // ua: 'user-agent-info',
  // fingerprint: 'fingerprint-info',
  // ip: '192.168.0.1',
  expiresIn: number;
  createdAt: number;
}
