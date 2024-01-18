import { TYPES } from './types'
import express, { Express } from 'express'
import { Server } from 'http'
import cors from 'cors'
import { MainRouter } from './router'
import { PrismaService } from './db/prisma.service'
import { inject, injectable } from 'inversify'
import { ILogger } from 'logger/logger.interface'
import { IExceptionFilter } from './errors/exception.filter.interface'
import cookieParser from 'cookie-parser'
import { IAuthMiddleware } from './middleware/interface/auth-middleware.interface'
import { RedisService } from './db/redis.service'


@injectable()
export class App {
	app: Express
	port: number
	server: Server

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prisma: PrismaService,
		@inject(TYPES.RedisService) private redis: RedisService,
		@inject(TYPES.MainRouter) private mainRouter: MainRouter,
		@inject(TYPES.IAuthMiddleware) private authMiddleware: IAuthMiddleware
	) {
		this.app = express()
		this.port = 3000
	}

	useRoutes() {
		this.app.use('/', this.mainRouter.router)
	}

	useMiddleware() {
		this.app.use(this.authMiddleware.useAuth.bind(this.authMiddleware))
	}

	useCors() {
		this.app.use(cors({ credentials: true }))
	}

	useBody() {
		this.app.use(express.json())
	}

	useCookies() {
		this.app.use(cookieParser())
	}

	useFilterException() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
	}

	public async init() {
		this.useBody()
		this.useCookies()
		this.useMiddleware()
		this.useRoutes()
		this.useFilterException()
		this.useCors()
		await this.prisma.connect()
		await this.redis.connect()

		this.server = this.app.listen(this.port)

		this.logger.log(`Server started om PORT = ${this.port}!`)
	}
}
