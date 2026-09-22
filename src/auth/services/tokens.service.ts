import { inject, singleton } from 'tsyringe';

import { ITokenData, ITokens } from '@/auth/interface/tokens.interface';
import { JwtService } from '@/auth/services/jwt.service';

@singleton()
export class TokenService {
  constructor(@inject(JwtService) private jwtService: JwtService) {}

  async generateTokens(userId: number, userRole: string): Promise<ITokens> {
    const data = { id: userId, role: userRole };

    const accessToken = await this.jwtService.sign(data);
    const refreshToken = crypto.randomUUID();

    return { accessToken, refreshToken };
  }

  async validateAccessToken(accessToken: string) {
    const tokenData = await this.jwtService.verify<ITokenData>(accessToken);
    if (!tokenData) return null;

    return tokenData;
  }
}
