import { singleton, inject } from 'tsyringe';

import { RedisService } from '@/db/redis.service';
import { IUserSession } from '@/auth/interface/sessions.interface';
import { HttpError } from '@/errors/http-error.class';

@singleton()
export class SessionsService {
  constructor(@inject(RedisService) private redisService: RedisService) {}

  async getSessionByKey(key: string) {
    const session = await this.redisService.hGetAll(key);
    if (!session) throw new HttpError(404, 'Session not found');
    return session;
  }

  async createSession(key: string, value: IUserSession) {
    await this.redisService.execMulti((multi) => {
      multi.hset(key, value);
      multi.expire(key, value.expiresIn);
      multi.sadd(value.userId, key);
    });
  }

  async deleteSession(key: string) {
    const session = await this.getSessionByKey(key);

    await this.redisService.execMulti((multi) => {
      multi.del(key);
      multi.srem(session?.userId, key);
    });
    return await this.redisService.del(key);
  }
}
