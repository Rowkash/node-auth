import { TYPES } from './types'
import { Router } from 'express'
import { inject, injectable } from 'inversify'
import { AuthRoutes } from './auth/auth.routes'
import { UserRoutes } from './users/users.routes'

@injectable()
export class MainRouter {
	router: Router

	constructor(
		@inject(TYPES.UserRoutes) private userRoutes: UserRoutes,
		@inject(TYPES.AuthRoutes) private authRoutes: AuthRoutes
	) {
		this.router = Router()
		this.initAllRoutes()
	}

	initAllRoutes() {
		this.userRoutes.initRoutes(this.router)
		this.authRoutes.initRoutes(this.router)

		return this.router
	}
}
