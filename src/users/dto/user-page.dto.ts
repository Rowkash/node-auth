import { z as zod } from 'zod';

import { PageDtoSchema } from '@/common/dto/page.dto';
import { UserSchema } from '@/users/user.schema';
import { AdminUserResponseSchema } from '@/users/dto/user-response.dto';

export enum UsersPageSortByEnum {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email',
}

export const AdminUsersPageSchema = PageDtoSchema.extend({
  ...UserSchema.pick({ name: true, email: true }).partial().shape,
  sortBy: zod
    .enum(UsersPageSortByEnum)
    .optional()
    .default(UsersPageSortByEnum.CREATED_AT),
});

export type TAdminUsersPageSchema = zod.infer<typeof AdminUsersPageSchema>;

export const AdminUsersPageResponseSchema = zod.object({
  models: zod.array(AdminUserResponseSchema),
  count: zod.number(),
});
