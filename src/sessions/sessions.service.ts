import { singleton, inject } from 'tsyringe';

import { RedisService } from '@/db/redis.service';
import { HttpError } from '@/errors/http-error.class';
import { type IUserSession } from '@/sessions/interface/sessions.interface';

@singleton()
export class SessionsService {
  constructor(@inject(RedisService) private redisService: RedisService) {}

  async getSessionByKey(key: string) {
    const session = await this.redisService.get<IUserSession>(key);
    if (!session)
      throw new HttpError(404, 'Session not found', 'SessionService');
    return session;
  }

  async createSession(key: string, value: IUserSession) {
    await this.redisService.execMulti((multi) => {
      multi.set(key, JSON.stringify(value));
      multi.expire(key, value.expiresIn);
      multi.sadd(String(value.userId), key);
    });
  }

  async deleteSession(key: string, userId: number) {
    await this.redisService.execMulti((multi) => {
      multi.del(key);
      multi.srem(String(userId), key);
    });
  }
}
