import { NextFunction, Request, Response } from 'express';
import { inject, singleton } from 'tsyringe';

import { HttpError } from '@/errors/http-error.class';
import { AuthService } from '@/auth/services/auth.service';
import { clearCookie, setCookie } from '@/utils/cookie.util';
import { authRegisterSchema } from '@/auth/dto/auth-register.dto';
import { authLoginSchema } from '@/auth/dto/auth-login.dto';

@singleton()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async register(req: Request, res: Response, _next: NextFunction) {
    const dto = authRegisterSchema.parse(req.body);
    const result = await this.authService.registration(dto);

    setCookie({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      res,
    });

    return res.json('Successfully registered');
  }

  async login(req: Request, res: Response) {
    const dto = authLoginSchema.parse(req.body);
    const result = await this.authService.login(dto);

    setCookie({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      res,
    });
    return res.json('Successfully logged in');
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      throw new HttpError(401, 'You are not logged in!', 'AuthController');

    await this.authService.logout(refreshToken, req.user.id);
    clearCookie(res);
    return res
      .status(200)
      .json({ message: 'You have successfully logged out' });
  }

  async refreshTokens(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      throw new HttpError(401, 'You are not logged in!', 'AuthController');

    const result = await this.authService.refreshTokens(refreshToken);
    setCookie({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      res,
    });
    return res.json('You have successfully refresh tokens');
  }
}
