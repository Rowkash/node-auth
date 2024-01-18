import { ITokenData, ITokens, ITokenService } from './interface/tokens.interface'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'
import { inject, injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

@injectable()
export class TokenService implements ITokenService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
	}

	// ---------- Generate tokens ---------- //

	async generateTokens(userId: number, userRole: string): Promise<ITokens> {
		const data = { id: userId, role: userRole }
		const accessSecret = this.configService.get('ACCESS_SECRET')

		const accessToken = jwt.sign(data, accessSecret, { expiresIn: '1h' })
		const refreshToken = uuidv4()

		return { accessToken, refreshToken }
	}

	// ---------- Validate access token ---------- //

	validateAccessToken(accessToken: string) {
		const secret = this.configService.get('ACCESS_SECRET')
		const userData = jwt.verify(accessToken, secret) as ITokenData
		if (!userData) return null

		return userData
	}

}