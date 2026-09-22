import { z as zod } from 'zod';
import {
  pgEnum,
  pgTable,
  integer,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { timestampsSchema } from '@/common/schemas/timestamps.schema';

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const UserSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  role: zod.enum(UserRoleEnum),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const userRolePgEnum = pgEnum('roles', UserRoleEnum);

export const usersTable = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    email: varchar('email').unique().notNull(),
    password: varchar('password').notNull(),
    role: userRolePgEnum().default(UserRoleEnum.USER).notNull(),
    ...timestampsSchema,
  },
  (table) => [uniqueIndex('email_idx').on(table.email)],
);

export type TUserSchema = InferSelectModel<typeof usersTable>;
export type TUserInsertSchema = InferInsertModel<typeof usersTable>;
