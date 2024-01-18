import { TYPES } from '../types'
import { ContainerModule, interfaces } from 'inversify'

import { UserRoutes } from './users.routes'
import { UserService } from './users.service'
import { UserRepository } from './users.repository'
import { UserController } from './users.controller'

import { IUserService } from './interface/users.service.interface'
import { IUserController } from './interface/users.controller.interface'
import { IUserRepository } from './interface/users.repository.interface'

export const usersModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<UserRoutes>(TYPES.UserRoutes).to(UserRoutes)
	bind<IUserService>(TYPES.IUserService).to(UserService)
	bind<IUserController>(TYPES.IUserController).to(UserController)
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository)
})