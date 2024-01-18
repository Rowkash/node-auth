import { NextFunction, Request, Response } from 'express';
import { inject, singleton } from 'tsyringe';

import { HttpError } from '@/errors/http-error.class';
import { SessionsService } from '@/sessions/sessions.service';
import { AuthService } from '@/auth/services/auth.service';
import { clearCookie, setCookie } from '@/utils/cookie.util';
import { authRegisterSchema } from '@/auth/dto/auth-register.dto';
import { authLoginSchema } from '@/auth/dto/auth-login.dto';

@singleton()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(SessionsService) private sessionsService: SessionsService,
  ) {}

  async register(req: Request, res: Response, _next: NextFunction) {
    const dto = authRegisterSchema.parse(req.body);
    const result = await this.authService.registration(dto);

    setCookie({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      res,
    });

    return res.json(result.user);
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
    const session = await this.sessionsService.getSessionByKey(refreshToken);
    if (!session) throw new HttpError(404, 'Session not found');

    await this.authService.logout(refreshToken);
    clearCookie(res);
    return res
      .status(200)
      .json({ message: 'You have successfully logged out' });
  }

  async refreshTokens(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      throw new HttpError(401, 'You are not logged in!', 'AuthController');

    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) throw new HttpError(401, 'Error getting new tokens');
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json('You have successfully refresh tokens');
  }
}
