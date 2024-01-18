import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
import { inject, singleton } from 'tsyringe';

import { ConfigService } from '@/config/config.service';

export type TSecretOrPrivateKey = jwt.Secret | jwt.PrivateKey;
export type TSecretOrPublicKey = jwt.Secret | jwt.PublicKey;

@singleton()
export class JwtService {
  private readonly secret: jwt.Secret;
  private readonly signOptions?: jwt.SignOptions;
  private readonly verifyOptions?: jwt.VerifyOptions;

  constructor(@inject(ConfigService) private configService: ConfigService) {
    this.secret = configService.get<string>('JWT_SECRET');
    this.signOptions = this.setSignOptions();
  }

  setSignOptions() {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    if (!Number.isFinite(+expiresIn)) {
      throw new Error(`Wrong JWT_EXPIRES_IN value in .env file`);
    }
    return { expiresIn: +expiresIn };
  }

  async sign(payload: object, options?: jwt.SignOptions): Promise<string> {
    const asyncSign = promisify<
      object,
      TSecretOrPrivateKey,
      jwt.SignOptions,
      string
    >(jwt.sign);
    return asyncSign(payload, this.secret, { ...this.signOptions, ...options });
  }

  async verify<T extends object>(
    token: string,
    options?: jwt.VerifyOptions,
  ): Promise<T> {
    const verifyAsync = promisify<
      string,
      TSecretOrPublicKey,
      jwt.VerifyOptions,
      T
    >(jwt.verify);
    return verifyAsync(token, this.secret, {
      ...this.verifyOptions,
      ...options,
    });
  }
}
