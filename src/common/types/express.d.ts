import { ICurrentUser } from '@/auth/interface/auth-middleware.interface';

declare global {
  namespace Express {
    interface Request {
      user: ICurrentUser;
    }
  }
}
