import 'reflect-metadata';
import { z as zod, ZodError } from 'zod';
import { container } from 'tsyringe';

import { App } from '@/app';
import { LoggerService } from '@/logger/logger.service';
import { EnvConfig, envSchema } from '@/config/env.schema';

async function bootstrap() {
  try {
    const envs = envSchema.parse(process.env);
    container.register<EnvConfig>('ENVS', { useValue: envs });
    const app = container.resolve(App);
    await app.init();
  } catch (error) {
    const logger = container.resolve(LoggerService);
    if (error instanceof ZodError) {
      const formattedErrors = zod.treeifyError<EnvConfig>(
        error as ZodError<EnvConfig>,
      );
      logger.error(
        'Invalid Environment Variables',
        undefined,
        formattedErrors?.properties ?? {},
      );
    } else if (error instanceof Error) {
      logger.error('Fatal error during application startup:', error);
    }
    process.exit(1);
  }
}

void bootstrap();
