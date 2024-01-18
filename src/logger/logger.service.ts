import pino, { Logger } from 'pino';
import { singleton } from 'tsyringe';

@singleton()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  }

  info(msg: string, obj?: object): void {
    this.logger.info(obj, msg);
  }

  error(msg: string, error?: Error, data?: object): void {
    this.logger.error({ error, ...data }, msg);
  }

  warn(msg: string, obj?: object): void {
    this.logger.warn(obj, msg);
  }
}
