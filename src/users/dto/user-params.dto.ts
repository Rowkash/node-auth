import { z as zod } from 'zod';

import { UserSchema } from '@/users/schemas/user.schema';

export const UserIdParamSchema = UserSchema.pick({
  id: true,
}).extend({
  id: zod.coerce.number().positive(),
});
