import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { PrismaService } from '../db/prisma.service'
import { IUserRepository } from './interface/users.repository.interface'
import { Role } from '@prisma/client'

@injectable()
export class UserRepository implements IUserRepository {

	constructor(@inject(TYPES.PrismaService) private prisma: PrismaService) {
	}

	async create(name: string, email: string, password: string) {
		return this.prisma.client.user.create({ data: { name: name, email: email, password: password } })
	}

	async delete(id: number) {
		return this.prisma.client.user.delete({ where: { id } })
	}

	async findByEmail(email: string) {
		return this.prisma.client.user.findUnique({ where: { email } })
	}

	async findById(id: number) {
		return this.prisma.client.user.findUnique({ where: { id } })
	}

	async getAll() {
		return this.prisma.client.user.findMany()
	}

	async updateRole(id: number, role: Role) {
		return this.prisma.client.user.update({ where: { id }, data: { role } })
	}
}