import { NextFunction, Request, Response } from 'express'
import { TYPES } from '../types'
import { inject, injectable } from 'inversify'
import { IUserService } from './interface/users.service.interface'
import { IUserController } from './interface/users.controller.interface'
import { HttpError } from '../errors/http-error.class'
import { IAuthRequest } from '../middleware/interface/auth-middleware.interface'


@injectable()

export class UserController implements IUserController {
	constructor(@inject(TYPES.IUserService) private service: IUserService) {
	}


	async getAll(req: IAuthRequest, res: Response, next: NextFunction) {
		try {
			// if (!req.user || req.user.role !== 'ADMIN') return next(new HttpError(403, 'Access denied'))

			const result = await this.service.getAllUsers()
			return res.json(result)
		} catch (error) {
			console.log(error)
			return next(error)
		}
	}

	async deleteUserById(req: IAuthRequest, res: Response, next: NextFunction) {
		try {
			if (!req.user && req.user.role !== 'ADMIN') return next(new HttpError(403, 'Access denied'))

			const { id } = req.params
			const result = await this.service.deleteUserById(+id)
			if (!result) return next(new HttpError(404, 'User not found'))

			return res.status(200).send()
		} catch (error) {
			return next(error)
		}
	}

	async updateUserRole(req: Request, res: Response, next: NextFunction) {
		try {
			const { user, role } = req.body
			const result = await this.service.updateRole(+user, role)
			if (!result) return next(new HttpError(404, 'User not found'))

			return res.json(result)
		} catch (error) {
			return next(error)

		}
	}
}