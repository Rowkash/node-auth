import { z as zod } from 'zod';

import { authRegisterSchema } from '@/auth/dto/auth-register.dto';

export const authLoginSchema = authRegisterSchema.pick({
  email: true,
  password: true,
});

export type AuthLoginDto = zod.infer<typeof authLoginSchema>;
