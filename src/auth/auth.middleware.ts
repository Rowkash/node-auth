import { inject, singleton } from 'tsyringe';
import { NextFunction, Response, Request } from 'express';

import { TokenService } from '@/auth/services/tokens.service';

@singleton()
export class AuthMiddleware {
  constructor(@inject(TokenService) private tokenService: TokenService) {}

  async useAuth(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      return next();
    }

    try {
      const tokenData =
        await this.tokenService.validateAccessToken(accessToken);
      if (!tokenData) {
        return next();
      }

      req.user = { ...tokenData };
      return next();
    } catch {
      return next();
    }
  }
}
