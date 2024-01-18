import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { IUserService } from '../users/interface/users.service.interface'
import { hash, verify } from 'argon2'
import { IAuthService, ILoginData, IRegistration, IRegistrationData } from './interface/auth.service.interface'
import { ITokenService } from './interface/tokens.interface'
import { SessionsService } from './sessions.service'
import { IUserSession } from './interface/sessions.interface'


@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.TokenService) private tokenService: ITokenService,
		@inject(TYPES.SessionService) private sessionsService: SessionsService
	) {
	}

	// ---------- Registration User ---------- //

	async registration(registerData: IRegistrationData): Promise<IRegistration> {
		const { name, email, password } = registerData

		const candidate = await this.userService.getUserByEmail(email)
		if (candidate) return null

		const hashPass = await hash(password)
		const user = await this.userService.createUser(name, email, hashPass)
		const tokens = await this.tokenService.generateTokens(user.id, user.role)
		const { refreshToken } = tokens

		const sessionData: IUserSession = {
			userId: String(user.id),
			refreshToken: refreshToken,
			expiresIn: 30 * 24 * 60 * 60 * 1000,
			createdAt: Date.now()
		}

		await this.sessionsService.createSession(refreshToken, sessionData)
		return { user: this.userService.returnUserFields(user.id, user.email), ...tokens }
	}

	// ---------- Login User ---------- //

	async login(loginData: ILoginData) {
		const { email, password } = loginData
		const user = await this.validateUser(email, password)
		if (!user) {
			return null
		}

		const tokens = await this.tokenService.generateTokens(user.id, user.role)
		const { refreshToken } = tokens

		const sessionData: IUserSession = {
			userId: String(user.id),
			refreshToken: refreshToken,
			expiresIn: 30 * 24 * 60 * 60 * 1000,
			createdAt: Date.now()
		}

		await this.sessionsService.createSession(refreshToken, sessionData)
		return tokens
	}

	// ---------- Logout ---------- //

	async logout(refreshToken: string) {
		return this.sessionsService.deleteSession(refreshToken)
	}

	// ---------- Refresh tokens ---------- //

	async refreshTokens(sessionKey: string) {

		const oldSession = await this.sessionsService.getSessionByKey(sessionKey)
		const user = await this.userService.getUserById(+oldSession.userId)
		if (!oldSession || !user) return null
		const { id, role } = user
		const tokens = await this.tokenService.generateTokens(id, role)
		const { refreshToken } = tokens

		await this.sessionsService.deleteSession(sessionKey)

		const sessionData: IUserSession = {
			userId: String(user.id),
			refreshToken: refreshToken,
			expiresIn: 30 * 24 * 60 * 60 * 1000,
			createdAt: Date.now()
		}

		await this.sessionsService.createSession(refreshToken, sessionData)

		return tokens
	}


	// ---------- Validate User ---------- //

	private async validateUser(email: string, password: string) {
		const user = await this.userService.getUserByEmail(email)
		if (user) {
			const passEquals = await verify(user.password, password)
			if (passEquals) return user
		}
		return null
	}

}