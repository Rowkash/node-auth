import { TYPES } from '../types'
import { IUserController } from './interface/users.controller.interface'
import { inject, injectable } from 'inversify'
import { Router } from 'express'

@injectable()
export class UserRoutes {
	constructor(
		@inject(TYPES.IUserController) private controller: IUserController
	) {
	}

	initRoutes(router: Router) {
		router.get('/users', this.controller.getAll.bind(this.controller))
		router.delete('/users/:id', this.controller.deleteUserById.bind(this.controller))
		router.patch('/users/roles', this.controller.updateUserRole.bind(this.controller))
	}
}
