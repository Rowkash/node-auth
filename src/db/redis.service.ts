import { inject, singleton } from 'tsyringe';
import Redis, { ChainableCommander, RedisKey } from 'ioredis';

import { LoggerService } from '@/logger/logger.service';
import { ConfigService } from '@/config/config.service';
import { EnvEnum } from '@/config/env.enum';

@singleton()
export class RedisService {
  client!: Redis;

  constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
  ) {}

  connect() {
    try {
      const host = this.configService.get(EnvEnum.REDIS_HOST);
      const port = this.configService.get(EnvEnum.REDIS_PORT);
      this.client = new Redis({ host, port });
      this.logger.info('[RedisService] Successful connection Redis');
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          '[RedisService] Error connecting Redis: ' + error.message,
        );
    }
  }

  async disconnect() {
    await this.client.quit();
    this.logger.info('[RedisService] Successful disconnect Redis');
  }

  async ping() {
    return this.client.ping();
  }

  async get<T>(key: RedisKey): Promise<T | null> {
    const result = await this.client.get(key);
    if (!result) return null;
    try {
      return JSON.parse(result) as T;
    } catch {
      return result as unknown as T;
    }
  }

  async execMulti(cb: (multi: ChainableCommander) => void | Promise<void>) {
    const multi = this.client.multi();
    await cb(multi);
    return multi.exec();
  }
}
