import { NextFunction, Request, Response } from 'express'
import { IAuthController } from './interface/auth.controller.interface'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { IAuthService } from './interface/auth.service.interface'
import { HttpError } from '../errors/http-error.class'
import { SessionsService } from './sessions.service'
import { loginSchema, registrationSchema } from './user-validation.schema'


@injectable()
export class AuthController implements IAuthController {
	constructor(@inject(TYPES.IAuthService) private authService: IAuthService,
							@inject(TYPES.SessionService) private sessionsService: SessionsService
	) {
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { value: userData, error } = loginSchema.validate(req.body)
			if (error) return next(new HttpError(400, `${error.message}`, 'Login'))
			const result = await this.authService.login(userData)

			if (!result) return next(new HttpError(401, 'Wrong email or password', 'Login'))

			res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			return res.json(result)
		} catch (error) {
			return next(error)
		}
	}

	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const { value: userData, error } = registrationSchema.validate(req.body)
			if (error) return next(new HttpError(400, `${error.message}`, 'Registration'))

			const result = await this.authService.registration(userData)
			if (!result) return next(new HttpError(404, 'User already exist', 'Registration'))

			res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

			return res.json(result)
		} catch (error) {
			return next(error)
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies
			if (!refreshToken) return next(new HttpError(401, 'Error refresh token'))
			const session = await this.sessionsService.getSessionByKey(refreshToken)
			if (!session) return next(new HttpError(404, 'Session not found'))
			await this.authService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.status(200).json({ message: 'You have successfully logged out' })
		} catch (error) {
			return next(error)
		}
	}

	async getNewTokens(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies
			if (!refreshToken) return next(new HttpError(401, 'Error getting refresh token', 'AuthController'))

			const tokens = await this.authService.refreshTokens(refreshToken)
			if (!tokens) return next(new HttpError(401, 'Error getting new tokens'))
			res.cookie('refreshToken', tokens.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
			return res.json(tokens)
		} catch (error) {
			return next(error)
		}
	}

	async getOneSession(req: Request, res: Response, next: NextFunction) {
		try {
			const { key } = req.params
			if (!key) return next(new HttpError(401, 'Oops, wrong session key'))
			const session = await this.sessionsService.getSessionByKey(key)
			console.log(session)
			if (!session) {
				return next(new HttpError(404, 'Session not found'))
			}
			return res.json(session)
		} catch (error) {
			return next(error)
		}
	}
}
