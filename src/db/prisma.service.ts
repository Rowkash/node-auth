import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/prisma/generated/client';
import { LoggerService } from '@/logger/logger.service';
import { inject, singleton } from 'tsyringe';

@singleton()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(LoggerService) private logger: LoggerService) {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    this.client = new PrismaClient({ adapter });
  }

  async connect() {
    try {
      await this.client.$connect();
      this.logger.info('[PrismaService] Successful connection to the Database');
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          '[PrismaService] Error connecting to Database: ' + error.message,
        );
    }
  }

  async disconnect() {
    await this.client.$disconnect();
    this.logger.info('[PrismaService] Successful disconnected from Database');
  }

  async ping() {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
