import { v4 as uuidv4 } from 'uuid';
import { inject, singleton } from 'tsyringe';

import { ConfigService } from '@/config/config.service';
import { ITokenData, ITokens } from '@/auth/interface/tokens.interface';
import { JwtService } from '@/auth/services/jwt.service';

@singleton()
export class TokenService {
  constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(JwtService) private jwtService: JwtService,
  ) {}

  // ---------- Generate tokens ---------- //

  async generateTokens(userId: number, userRole: string): Promise<ITokens> {
    const data = { id: userId, role: userRole };
    // const accessSecret = this.configService.get<string>('ACCESS_SECRET');

    // const accessToken = jwt.sign(data, accessSecret, { expiresIn: '1h' });
    const accessToken = await this.jwtService.sign(data);
    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }

  // ---------- Validate access token ---------- //

  async validateAccessToken(accessToken: string) {
    // const secret = this.configService.get<string>('ACCESS_SECRET');
    // const tokenData = jwt.verify(accessToken, secret) as ITokenData;
    const tokenData = await this.jwtService.verify<ITokenData>(accessToken);
    if (!tokenData) return null;

    return tokenData;
  }
}
