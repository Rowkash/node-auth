import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { IUserService } from './interface/users.service.interface'
import { IUserRepository } from './interface/users.repository.interface'
import { Role } from '@prisma/client'

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IUserRepository) private repository: IUserRepository
	) {
	}


	async createUser(name: string, email: string, password: string) {
		return await this.repository.create(name, email, password)
	}


	async deleteUserById(id: number) {
		const user = await this.getUserById(id)
		if (!user) {
			return null
		}
		return await this.repository.delete(id)
	}

	async getUserByEmail(email: string) {
		return await this.repository.findByEmail(email)
	}

	async getUserById(id: number) {
		return await this.repository.findById(id)
	}

	async getAllUsers() {
		return await this.repository.getAll()
	}


	returnUserFields(userId: number, userEmail: string) {
		return { id: userId, email: userEmail }
	}

	async updateRole(id: number, role: string) {
		const user = await this.repository.findById(id)
		if (!user) {
			return null
		}
		const newRole = role as Role
		return await this.repository.updateRole(id, newRole)
	}
}