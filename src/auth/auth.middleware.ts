import { inject, singleton } from 'tsyringe';
import { NextFunction, Response } from 'express';

import { TokenService } from '@/auth/services/tokens.service';
import { IAuthRequest } from '@/auth/interface/auth-middleware.interface';

@singleton()
export class AuthMiddleware {
  constructor(@inject(TokenService) private tokenService: TokenService) {}

  async useAuth(req: IAuthRequest, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      req.user = undefined;
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
      req.user = undefined;
      return next();
    }
  }
}
