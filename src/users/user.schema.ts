import { z as zod } from 'zod';

import { Role } from '@/prisma/generated/enums';

export const UserSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  role: zod.enum(Role),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});
