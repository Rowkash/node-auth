// import {
//   ContainerModule,
//   ContainerModuleLoadOptions,
//   Container,
// } from 'inversify';
// import { App } from '@/app';
// import { TYPES } from '@/types';
// import { MainRouter } from '@/router';
// import { PrismaService } from '@/db/prisma.service';
// import { ConfigService } from '@/config/config.service';
// import { RedisService } from '@/db/redis.service';
// import { ExceptionFilter } from '@/errors/exeption.filter';
// import { LoggerService } from '@/logger/logger.service';
// import { usersModule } from '@/users/users.module';
// import { authModule } from '@/auth/auth.module';
// import { sessionsModule } from '@/sessions/sessions.module';
//
// export const commonModule = new ContainerModule(
//   (options: ContainerModuleLoadOptions) => {
//     options.bind<App>(TYPES.Application).to(App);
//     options.bind<MainRouter>(TYPES.MainRouter).to(MainRouter);
//     options
//       .bind<LoggerService>(TYPES.Logger)
//       .to(LoggerService)
//       .inSingletonScope();
//     options.bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
//     options.bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
//     options
//       .bind<ConfigService>(TYPES.ConfigService)
//       .to(ConfigService)
//       .inSingletonScope();
//     options
//       .bind<RedisService>(TYPES.RedisService)
//       .to(RedisService)
//       .inSingletonScope();
//   },
// );
//
// const appContainer = new Container();
//
// appContainer.load(commonModule, usersModule, authModule, sessionsModule);
//
// export { appContainer };
