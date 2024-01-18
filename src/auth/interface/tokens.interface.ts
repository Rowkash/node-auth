export interface ITokenService {
	generateTokens: (id: number, userRole: string) => Promise<ITokens>
	validateAccessToken: (accessToken: string) => ITokenData | null
}

export interface ITokens {
	accessToken: string,
	refreshToken: string
}

export interface ITokenData {
	id: number
	role: string
}