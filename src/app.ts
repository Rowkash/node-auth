import express, { Express, urlencoded } from 'express';
import { Server } from 'http';
import cors from 'cors';
import { singleton, inject } from 'tsyringe';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { PrismaService } from '@/db/prisma.service';
import { RedisService } from '@/db/redis.service';
import { MainRouter } from '@/router';
import { LoggerService } from '@/logger/logger.service';
import { AuthMiddleware } from '@/auth/auth.middleware';
import { ExceptionFilter } from '@/errors/exeption.filter';
import { ConfigService } from '@/config/config.service';

@singleton()
export class App {
  app: Express;
  port: number;
  server!: Server;

  constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(ExceptionFilter) private exceptionFilter: ExceptionFilter,
    @inject(PrismaService) private prisma: PrismaService,
    @inject(RedisService) private redis: RedisService,
    @inject(MainRouter) private mainRouter: MainRouter,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
  ) {
    this.app = express();
    this.port = this.configService.get('APP_PORT');
  }

  useRoutes() {
    this.app.use('/', this.mainRouter.router);
  }

  useMiddleware() {
    this.app.use(helmet());
    this.app.use(urlencoded({ extended: true, limit: '50mb' }));
    this.app.get('/favicon.ico', (req, res) => res.status(204).end());
    this.app.use(this.authMiddleware.useAuth.bind(this.authMiddleware));
  }

  useCors() {
    this.app.use(cors({ credentials: true }));
  }

  useBody() {
    this.app.use(express.json());
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

      await this.prisma.disconnect();
      await this.redis.disconnect();

      clearTimeout(forceExitTimeout);

      this.logger.info('Shutdown complete.');

      process.exit(0);
    } catch (error) {
      this.logger.error('Shutdown error', error);
      process.exit(1);
    }
  }

  public async init() {
    this.useBody();
    this.useCookies();
    this.useMiddleware();
    this.useRoutes();
    this.useFilterException();
    this.useCors();
    await this.prisma.connect();
    this.redis.connect();
    this.useGracefulShutdown();

    this.server = this.app.listen(this.port);

    this.logger.info(`Server started om PORT = ${this.port}!`);
  }
}
