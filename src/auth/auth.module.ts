import { TYPES } from '../types'
import { ContainerModule, interfaces } from 'inversify'

import { AuthRoutes } from './auth.routes'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthMiddleware } from '../middleware/auth-middleware'

import { IAuthService } from './interface/auth.service.interface'
import { IAuthController } from './interface/auth.controller.interface'
import { IAuthMiddleware } from '../middleware/interface/auth-middleware.interface'

import { TokenService } from './tokens.service'
import { SessionsService } from './sessions.service'
import { ITokenService } from './interface/tokens.interface'

export const authModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes)
	bind<IAuthService>(TYPES.IAuthService).to(AuthService)
	bind<IAuthController>(TYPES.IAuthController).to(AuthController)
	bind<IAuthMiddleware>(TYPES.IAuthMiddleware).to(AuthMiddleware)

	bind<SessionsService>(TYPES.SessionService).to(SessionsService)
	bind<ITokenService>(TYPES.TokenService).to(TokenService)

})