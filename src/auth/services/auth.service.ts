import { hash, verify } from 'argon2';
import { singleton, inject } from 'tsyringe';

import {
  ILoginData,
  IRegistrationData,
} from '@/auth/interface/auth.service.interface';
import type { IUserSession } from '@/auth/interface/sessions.interface';
import { SessionsService } from '@/sessions/sessions.service';
import { TokenService } from '@/auth/services/tokens.service';
import { UserService } from '@/users/users.service';
import { HttpError } from '@/errors/http-error.class';

@singleton()
export class AuthService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(TokenService) private tokenService: TokenService,
    @inject(SessionsService) private sessionsService: SessionsService,
  ) {}

  // ---------- Registration User ---------- //

  async registration(registerData: IRegistrationData) {
    const { name, email, password } = registerData;

    const candidate = await this.userService.getUserByEmail(email);
    if (candidate) {
      throw new HttpError(404, 'User already exist', 'Registration');
    }

    const hashPass = await hash(password);
    const user = await this.userService.createUser(name, email, hashPass);
    const tokens = await this.tokenService.generateTokens(user.id, user.role);
    const { refreshToken } = tokens;

    const sessionData: IUserSession = {
      userId: String(user.id),
      refreshToken: refreshToken,
      expiresIn: 30 * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
    };

    await this.sessionsService.createSession(refreshToken, sessionData);
    return {
      user: this.userService.returnUserFields(user.id, user.email),
      ...tokens,
    };
  }

  // ---------- Login User ---------- //

  async login(loginData: ILoginData) {
    const { email, password } = loginData;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new HttpError(401, 'Wrong email or password', 'Login');
    }

    const tokens = await this.tokenService.generateTokens(user.id, user.role);
    const { refreshToken } = tokens;

    const sessionData: IUserSession = {
      userId: String(user.id),
      refreshToken: refreshToken,
      expiresIn: 30 * 24 * 60 * 60,
      createdAt: Date.now(),
    };

    await this.sessionsService.createSession(refreshToken, sessionData);
    return tokens;
  }

  // ---------- Logout ---------- //

  async logout(refreshToken: string) {
    return this.sessionsService.deleteSession(refreshToken);
  }

  // ---------- Refresh tokens ---------- //

  async refreshTokens(sessionKey: string) {
    const oldSession = await this.sessionsService.getSessionByKey(sessionKey);
    if (!oldSession) return null;
    const user = await this.userService.getUserById(+oldSession.userId);
    if (!user) return null;
    const { id, role } = user;
    const tokens = await this.tokenService.generateTokens(id, role);
    const { refreshToken } = tokens;

    await this.sessionsService.deleteSession(sessionKey);

    const sessionData: IUserSession = {
      userId: String(user.id),
      refreshToken: refreshToken,
      expiresIn: 30 * 24 * 60 * 60,
      createdAt: Date.now(),
    };

    await this.sessionsService.createSession(refreshToken, sessionData);

    return tokens;
  }

  // ---------- Validate User ---------- //

  private async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      const passEquals = await verify(user.password, password);
      if (passEquals) return user;
    }
    return null;
  }
}
