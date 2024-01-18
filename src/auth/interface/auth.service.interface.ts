import { ITokens } from './tokens.interface'

export interface IAuthService {
	registration: (registerData: IRegistrationData) => Promise<IRegistration> | null
	login: (loginData: ILoginData) => Promise<ITokens> | null
	logout: (refreshToken: string) => Promise<number>
	refreshTokens: (sessionKey: string) => Promise<ITokens> | null
}

export interface IRegistration extends ITokens {
	user: {
		id: number
		email: string
	}
}

export interface IRegistrationData {
	name: string,
	email: string,
	password: string
}

export interface ILoginData extends Omit<IRegistrationData, 'name'> {
}
