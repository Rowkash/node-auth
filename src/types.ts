export const TYPES = {
	ILogger: Symbol.for('ILogger'),
	MainRouter: Symbol.for('MainRouter'),
	Application: Symbol.for('Application'),
	RedisService: Symbol.for('RedisService'),
	PrismaService: Symbol.for('PrismaService'),
	ConfigService: Symbol.for('ConfigService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	IAuthMiddleware: Symbol.for('IAuthMiddleware'),

	// ---------- User ---------- //

	UserRoutes: Symbol.for('UserRoutes'),
	IUserService: Symbol.for('IUserService'),
	IUserRepository: Symbol.for('IUserRepository'),
	IUserController: Symbol.for('IUserController'),

	// ---------- Auth ---------- //

	AuthRoutes: Symbol.for('AuthRoutes'),
	IAuthService: Symbol.for('IAuthService'),
	IAuthController: Symbol.for('IAuthController'),


	// ---------- Token ---------- //

	TokenService: Symbol.for('TokenService'),

	// ---------- Sessions ---------- //

	SessionService: Symbol.for('SessionService')
}
