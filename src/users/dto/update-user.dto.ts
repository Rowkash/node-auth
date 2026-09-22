import { z as zod } from 'zod';

import { UserSchema } from '@/users/schemas/user.schema';

export const UpdateUserSchemaDto = UserSchema.pick({
  name: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type TUpdateUserDto = zod.infer<typeof UpdateUserSchemaDto>;
