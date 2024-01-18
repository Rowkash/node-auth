import { NextFunction, Response } from 'express';
import { IAuthRequest } from '@/auth/interface/auth-middleware.interface';
import { Role } from '@/prisma/generated/enums';
import { HttpError } from '@/errors/http-error.class';

export class RolesAccessGuard {
  handle(allowedRoles: Role[]) {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        console.log('roles guard', req.user);
        throw new HttpError(404, 'Access denied', 'RolesAccessGuard');
      }
      next();
    };
  }
}
