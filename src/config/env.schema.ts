import { z as zod } from 'zod';

export enum NodeEnvEnum {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

const appSchema = zod.object({
  NODE_ENV: zod.enum(NodeEnvEnum).default(NodeEnvEnum.DEVELOPMENT),
  APP_PORT: zod.coerce.number().default(3000),
});

const postgresSchema = zod.object({
  POSTGRES_HOST: zod.string().min(1),
  POSTGRES_PORT: zod.coerce.number().default(5432),
  POSTGRES_USER: zod.string().min(1),
  POSTGRES_PASSWORD: zod.string().min(1),
  POSTGRES_DB: zod.string().min(1),
  DATABASE_URL: zod.url(),
});

const jwtSchema = zod.object({
  JWT_SECRET: zod.string().min(8, 'Secret is too short'),
  JWT_EXPIRES_IN: zod.coerce.number(),
});

const redisSchema = zod.object({
  REDIS_URI: zod.url(),
  REDIS_HOST: zod.string().min(1),
  REDIS_PORT: zod.coerce.number().default(6379),
});

export const envSchema = zod.object({
  ...appSchema.shape,
  ...postgresSchema.shape,
  ...jwtSchema.shape,
  ...redisSchema.shape,
});

export type EnvConfig = zod.infer<typeof envSchema>;
