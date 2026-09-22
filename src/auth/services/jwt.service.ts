import jwt from 'jsonwebtoken';
import { inject, singleton } from 'tsyringe';

import { ConfigService } from '@/config/config.service';
import { EnvEnum } from '@/config/env.enum';

export type TJwtConfig = {
  secret: jwt.Secret;
  signOptions: jwt.SignOptions;
  verifyOptions?: jwt.VerifyOptions;
};

@singleton()
export class JwtService {
  private jwtConfig!: TJwtConfig;

  constructor(@inject(ConfigService) private configService: ConfigService) {
    this.init();
  }
  init() {
    const secret = this.configService.get(EnvEnum.JWT_SECRET);
    const expiresIn = this.configService.get(EnvEnum.JWT_EXPIRES_IN);
    this.jwtConfig = { secret, signOptions: { expiresIn } };
  }

  async sign(payload: object, options?: jwt.SignOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.jwtConfig.secret,
        { ...this.jwtConfig.signOptions, ...options },
        (err, token) => {
          if (err) return reject(err);
          if (!token)
            return reject(
              new Error(
                '[JwtService] Something went wrong while signing jwt payload',
              ),
            );
          resolve(token);
        },
      );
    });
  }

  async verify<T extends object>(
    token: string,
    options?: jwt.VerifyOptions,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      jwt.verify(
        token,
        this.jwtConfig.secret,
        {
          ...this.jwtConfig.verifyOptions,
          ...options,
        },
        (err, decoded) => {
          if (err) return reject(err);
          if (!decoded)
            return reject(
              new Error(
                '[JwtService] Something went wrong while verifying JWT token',
              ),
            );
          resolve(decoded as T);
        },
      );
    });
  }
}
