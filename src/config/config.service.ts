import { inject, singleton } from 'tsyringe';

import type { EnvConfig } from '@/config/env.schema';

@singleton()
export class ConfigService {
  constructor(@inject('ENVS') private readonly config: EnvConfig) {}

  get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.config[key];
  }
}
