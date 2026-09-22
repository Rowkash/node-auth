import { z as zod } from 'zod';

export const sessionResponseSchema = zod.object({
  userId: zod.coerce.number(),
  refreshToken: zod.uuid(),
  expiresIn: zod.coerce.number(),
  createdAt: zod.coerce.number(),
});

export type TSessionResponseDto = zod.infer<typeof sessionResponseSchema>;
