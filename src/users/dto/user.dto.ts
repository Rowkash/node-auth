import { z as zod } from 'zod';
import { Role } from '@/prisma/generated/enums';

export const userSchema = zod.object({
  id: zod.coerce.number(),
  name: zod.string().min(2).max(60),
  email: zod.email(),
  password: zod.string().min(6).max(60),
  role: zod.enum(Role),
});

export const userIdParamSchema = userSchema.pick({
  id: true,
});
