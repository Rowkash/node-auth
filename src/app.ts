import express, { Express, urlencoded } from 'express';
import { createServer, Server } from 'http';
import cors from 'cors';
import { singleton, inject } from 'tsyringe';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { RedisService } from '@/db/redis.service';
import { MainRouter } from '@/router';
import { LoggerService } from '@/logger/logger.service';
import { AuthMiddleware } from '@/auth/auth.middleware';
import { ExceptionFilter } from '@/errors/exeption.filter';
import { ConfigService } from '@/config/config.service';
import { DrizzleService } from '@/db/drizzle.service';
import { EnvEnum } from '@/config/env.enum';

@singleton()
export class App {
  app: Express;
  server: Server;

  constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(ExceptionFilter) private exceptionFilter: ExceptionFilter,
    @inject(DrizzleService) private drizzle: DrizzleService,
    @inject(RedisService) private redis: RedisService,
    @inject(MainRouter) private mainRouter: MainRouter,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
  ) {
    this.app = express();
    this.server = createServer(this.app);
  }

  useRoutes() {
    this.app.use('/', this.mainRouter.router);
  }

  useMiddleware() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: true, limit: '50mb' }));
    this.app.get('/favicon.ico', (req, res) => res.status(204).end());
    this.app.use(this.authMiddleware.useAuth.bind(this.authMiddleware));
  }

  useCors() {
    this.app.use(cors({ credentials: true }));
  }

  useCookies() {
    this.app.use(cookieParser());
  }

  useFilterException() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  useGracefulShutdown() {
    process.on('SIGTERM', () => void this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => void this.gracefulShutdown('SIGINT'));
  }

  private async gracefulShutdown(signal: string) {
    this.logger.warn(`${signal} received. Starting graceful shutdown...`);

    const forceExitTimeout = setTimeout(() => {
      this.logger.error(
        'Graceful shutdown timeout exceeded. Force exiting process.',
      );
      process.exit(1);
    }, 10000);

    try {
      await new Promise<void>((resolve, reject) => {
        this.server.close((err) => {
          if (err) return reject(err);
          this.logger.info('HTTP server closed');
          resolve();
        });
      });

      await this.drizzle.disconnect();
      await this.redis.disconnect();

      clearTimeout(forceExitTimeout);

      this.logger.info('Shutdown complete.');

      process.exit(0);
    } catch (error) {
      this.logger.error('Shutdown error', error as Error);
      process.exit(1);
    }
  }

  public async init() {
    this.useCors();
    this.useCookies();
    this.useMiddleware();
    this.useRoutes();
    this.useFilterException();
    await this.drizzle.connect();
    this.redis.connect();
    this.useGracefulShutdown();

    const PORT = this.configService.get(EnvEnum.APP_PORT);

    this.server.listen(PORT, () =>
      this.logger.info(`Server started om PORT = ${PORT}`),
    );
  }
}
