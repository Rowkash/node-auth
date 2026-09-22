import { Request } from 'express';

import { UserRoleEnum } from '@/users/schemas/user.schema';

export interface IAuthRequest extends Request {
  user: ICurrentUser;
}

export interface ICurrentUser {
  id: number;
  role: UserRoleEnum;
}
