export interface ISessions {
	getSessionByKey: (refreshToken: string) => Promise<Record<string, string> | IUserSession | null>
	createSession: (key: string, value: IUserSession) => Promise<number>
	deleteSession: (key: string) => Promise<number>
}

export interface IUserSession {
	userId: string
	refreshToken: string
	// ua: 'user-agent-info',
	// fingerprint: 'fingerprint-info',
	// ip: '192.168.0.1',
	expiresIn: number,
	createdAt: number
}