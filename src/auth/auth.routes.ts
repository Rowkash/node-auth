import { inject, injectable } from 'inversify'
import { Router } from 'express'
import { IAuthController } from './interface/auth.controller.interface'
import { TYPES } from '../types'

import 'reflect-metadata'

@injectable()
export class AuthRoutes {
	constructor(
		@inject(TYPES.IAuthController) private controller: IAuthController
	) {
	}

	initRoutes(router: Router) {
		router.post('/auth/login', this.controller.login.bind(this.controller))
		router.post(
			'/auth/registration',
			this.controller.register.bind(this.controller)
		)
		router.post('/auth/login/refresh-token', this.controller.getNewTokens.bind(this.controller))
		router.get('/auth/sessions/:key', this.controller.getOneSession.bind(this.controller))
		router.delete('/auth/logout', this.controller.logout.bind(this.controller))
	}
}
