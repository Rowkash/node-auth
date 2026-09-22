import { z as zod } from 'zod';

import { UserRoleEnum, UserSchema } from '@/users/schemas/user.schema';

export const BaseUserResponseSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  createdAt: true,
});

export const AdminUserResponseSchema = BaseUserResponseSchema.extend({
  role: zod.enum(UserRoleEnum),
  createdAt: zod.date(),
});
