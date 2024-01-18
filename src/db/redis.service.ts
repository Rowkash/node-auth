import { inject, singleton } from 'tsyringe';
import Redis, { ChainableCommander, RedisKey } from 'ioredis';

import { LoggerService } from '@/logger/logger.service';

@singleton()
export class RedisService {
  client!: Redis;

  constructor(@inject(LoggerService) private logger: LoggerService) {}

  connect() {
    try {
      this.client = new Redis();
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

  async hSet(key: RedisKey, obj: object, expiresIn: number) {
    await this.client.hset(key, obj);
    await this.client.expire(key, expiresIn);
  }

  async del(key: RedisKey) {
    return this.client.del(key);
  }

  async hGetAll(key: RedisKey) {
    const result = await this.client.hgetall(key);
    if (Object.keys(result).length === 0) {
      return null;
    }
    return result;
  }

  async hGet(key: RedisKey, field: string) {
    return this.client.hget(key, field);
  }

  async rename(key: RedisKey, newKey: RedisKey) {
    this.client.pipeline();
    return this.client.rename(key, newKey);
  }

  async execMulti(cb: (multi: ChainableCommander) => void | Promise<void>) {
    const multi = this.client.multi();
    await cb(multi);
    return multi.exec();
  }
}
