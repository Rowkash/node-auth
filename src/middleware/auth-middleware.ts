import { NextFunction, Response } from 'express'
import { TYPES } from '../types'
import { ITokenService } from '../auth/interface/tokens.interface'
import { inject, injectable } from 'inversify'
import { IAuthMiddleware, IAuthRequest } from './interface/auth-middleware.interface'


@injectable()
export class AuthMiddleware implements IAuthMiddleware {
	constructor(
		@inject(TYPES.TokenService) private tokenService: ITokenService
	) {
	}

	public async useAuth(req: IAuthRequest, res: Response, next: NextFunction) {
		const { authorization: token } = req.headers
		if (!token) {
			req.user = null
			return next()
		}

		try {
			const { id, role } = this.tokenService.validateAccessToken(token)
			req.user = { id, role }

			return next()
		} catch (error) {
			req.user = null
			return next()
		}
	}
}