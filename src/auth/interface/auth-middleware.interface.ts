import { Request } from 'express';

import { Role } from '@/prisma/generated/enums';

export interface IAuthRequest extends Request {
  user?: ICurrentUser;
}

interface ICurrentUser {
  id: number;
  role: Role;
}
