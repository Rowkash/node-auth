import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, singleton } from 'tsyringe';

import { LoggerService } from '@/logger/logger.service';

@singleton()
export class ConfigService {
  readonly config!: DotenvParseOutput;

  constructor(@inject(LoggerService) private logger: LoggerService) {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      this.logger.error(
        '[ConfigService] The file ".env" could not be read or is missing',
      );
    } else {
      this.logger.info('[ConfigService] Configuration ".env" loaded');
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get<T extends number | string>(key: string): T {
    return this.config[key] as T;
  }
}
