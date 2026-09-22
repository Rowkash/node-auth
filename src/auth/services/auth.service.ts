import { hash, verify } from 'argon2';
import { singleton, inject } from 'tsyringe';
import { constants as statusCode } from 'http2';

import {
  ILoginData,
  IRegistrationData,
} from '@/auth/interface/auth.service.interface';
import { type IUserSession } from '@/sessions/interface/sessions.interface';
import { SessionsService } from '@/sessions/sessions.service';
import { TokenService } from '@/auth/services/tokens.service';
import { UserService } from '@/users/users.service';
import { HttpError } from '@/errors/http-error.class';
import { TUserSchema } from '@/users/schemas/user.schema';

@singleton()
export class AuthService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(TokenService) private tokenService: TokenService,
    @inject(SessionsService) private sessionsService: SessionsService,
  ) {}

  async registration(registerData: IRegistrationData) {
    const { name, email, password } = registerData;

    const candidate = await this.userService.getOne({ email });
    if (candidate) {
      throw new HttpError(
        statusCode.HTTP_STATUS_BAD_REQUEST,
        'Email already exist',
        'Registration',
      );
    }

    const hashPass = await hash(password);
    const user = await this.userService.create({
      name,
      email,
      password: hashPass,
    });
    const tokens = await this.tokenService.generateTokens(user.id, user.role);

    const sessionData = this.buildSessionData(user, tokens.refreshToken);

    await this.sessionsService.createSession(tokens.refreshToken, sessionData);
    return tokens;
  }

  async login(loginData: ILoginData) {
    const { email, password } = loginData;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new HttpError(
        statusCode.HTTP_STATUS_BAD_REQUEST,
        'Wrong email or password',
        'Login',
      );
    }

    const tokens = await this.tokenService.generateTokens(user.id, user.role);

    const sessionData = this.buildSessionData(user, tokens.refreshToken);

    await this.sessionsService.createSession(tokens.refreshToken, sessionData);
    return tokens;
  }

  async logout(refreshToken: string, userId: number) {
    return this.sessionsService.deleteSession(refreshToken, userId);
  }

  async refreshTokens(sessionKey: string) {
    const oldSession = await this.sessionsService.getSessionByKey(sessionKey);
    if (!oldSession)
      throw new HttpError(
        statusCode.HTTP_STATUS_BAD_REQUEST,
        'Wrong session key',
        'Refresh tokens',
      );
    const { userId, userRole } = oldSession;
    const tokens = await this.tokenService.generateTokens(userId, userRole);

    await this.sessionsService.deleteSession(sessionKey, userId);

    const sessionData = this.buildSessionData(
      { id: userId, role: userRole },
      tokens.refreshToken,
    );

    await this.sessionsService.createSession(tokens.refreshToken, sessionData);

    return tokens;
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.getOne({ email });
    if (user) {
      const passEquals = await verify(user.password, password);
      if (passEquals) return user;
    }
    return null;
  }

  private buildSessionData(
    user: Pick<TUserSchema, 'id' | 'role'>,
    refreshToken: string,
  ): IUserSession {
    return {
      userId: user.id,
      userRole: user.role,
      refreshToken: refreshToken,
      expiresIn: 30 * 24 * 60 * 60,
      createdAt: Date.now(),
    };
  }
}
