import { Pool } from 'pg';
import { inject, singleton } from 'tsyringe';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import { EnvEnum } from '@/config/env.enum';
import { LoggerService } from '@/logger/logger.service';
import { ConfigService } from '@/config/config.service';

@singleton()
export class DrizzleService {
  client!: NodePgDatabase;
  private readonly pool: Pool;

  constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const connectionString = this.configService.get(EnvEnum.DATABASE_URL);
    this.pool = new Pool({ connectionString });
  }

  async connect() {
    try {
      this.client = drizzle({
        client: this.pool,
      });
      await this.client.execute('select 1');
      this.logger.info(`[DrizzleService] Drizzle successfully connected`);
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          '[DrizzleService] Error connecting to Database: ' + error.message,
        );
    }
  }

  async disconnect() {
    await this.pool.end();
    this.logger.info('[DrizzleService] Successful disconnected from Database');
  }

  async ping() {
    try {
      await this.client.execute('select 1');
      return true;
    } catch {
      return false;
    }
  }
}
