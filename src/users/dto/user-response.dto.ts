import { z as zod } from 'zod';

import { Role } from '@/prisma/generated/enums';
import { UserSchema } from '@/users/user.schema';

export const BaseUserResponseSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  createdAt: true,
});

export const AdminUserResponseSchema = BaseUserResponseSchema.extend({
  role: zod.enum(Role),
  createdAt: zod.date(),
});
