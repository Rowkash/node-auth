import { inject, singleton } from 'tsyringe';
import { Request, Response } from 'express';

import { ConfigService } from '@/config/config.service';
import { RedisService } from '@/db/redis.service';
import { PrismaService } from '@/db/prisma.service';

@singleton()
export class HealthController {
  constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(RedisService) private redisService: RedisService,
    @inject(PrismaService) private prismaService: PrismaService,
  ) {}

  check(req: Request, res: Response) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timeStamp: new Date(),
    };
    return res.status(200).send(healthcheck);
  }

  async ready(req: Request, res: Response) {
    const checks = {
      database: false,
      redis: false,
    };
    try {
      checks.redis = (await this.redisService.ping()) === 'PONG';
      checks.database = await this.prismaService.ping();
      const allHealthy = Object.values(checks).every(Boolean);

      return res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'ready' : 'not_ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(503).json({
        status: 'not_ready',
        checks,
        error: error.message,
      });
    }
  }
}
