import { z as zod } from 'zod';

import { BaseAuthSchema } from '@/auth/dto/auth-register.dto';

export const authLoginSchema = BaseAuthSchema.pick({
  email: true,
  password: true,
});

export type AuthLoginDto = zod.infer<typeof authLoginSchema>;
