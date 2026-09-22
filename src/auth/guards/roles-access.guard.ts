import { NextFunction, Response, Request } from 'express';

import { HttpError } from '@/errors/http-error.class';
import { UserRoleEnum } from '@/users/schemas/user.schema';

export class RolesAccessGuard {
  handle(allowedRoles: UserRoleEnum[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        console.log('roles guard', req.user);
        throw new HttpError(403, 'Access denied', 'RolesAccessGuard');
      }
      next();
    };
  }
}
