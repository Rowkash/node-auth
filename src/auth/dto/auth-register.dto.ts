import { z as zod } from 'zod';

export const BaseAuthSchema = zod.object({
  name: zod.string().min(2).max(60),
  email: zod.email(),
  password: zod.string().min(6).max(60),
  confirmPassword: zod.string().min(6).max(60).optional(),
});

export const authRegisterSchema = BaseAuthSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  },
);

export type AuthRegisterDto = zod.infer<typeof authRegisterSchema>;
