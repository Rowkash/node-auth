import { Role, User } from '@prisma/client'

export interface IUserService {
	createUser: (email: string, password: string, name: string) => Promise<User>
	deleteUserById: (id: number) => object
	getUserByEmail: (email: string) => Promise<User> | null
	getUserById: (id: number) => Promise<User> | null
	getAllUsers: () => Promise<User[]>
	returnUserFields: (userId: number, userEmail: string) => { id: number, email: string }
	updateRole: (id: number, role: Role) => Promise<User> | null
}