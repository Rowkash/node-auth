import { Role, User } from '@prisma/client'

export interface IUserRepository {
	create: (email: string, password: string, name: string) => Promise<User>
	delete: (id: number) => object
	findByEmail: (email: string) => Promise<User> | null
	findById: (id: number) => Promise<User> | null
	getAll: () => Promise<User[]>
	updateRole: (id: number, role: Role) => Promise<User> | null
}