import { App } from '../app'
import { TYPES } from '../types'
import { MainRouter } from '../router'
import { PrismaService } from '../db/prisma.service'
import { ILogger } from '../logger/logger.interface'
import { LoggerService } from '../logger/logger.service'
import { IExceptionFilter } from '../errors/exception.filter.interface'
import { ExceptionFilter } from '../errors/exeption.filter'
import { IConfigService } from './config.service.interface'
import { ConfigService } from './config.service'
import { RedisService } from '../db/redis.service'
import { Container, ContainerModule, interfaces } from 'inversify'
import { usersModule } from '../users/users.module'
import { authModule } from '../auth/auth.module'

export const commonModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App)
	bind<MainRouter>(TYPES.MainRouter).to(MainRouter)
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService)
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
	bind<RedisService>(TYPES.RedisService).to(RedisService).inSingletonScope()
})

const appContainer = new Container()

appContainer.load(commonModule, usersModule, authModule)

export { appContainer }
