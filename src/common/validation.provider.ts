import { z as zod } from 'zod';
import { singleton } from 'tsyringe';
import { Response, NextFunction } from 'express';

import { IAuthRequest } from '@/auth/interface/auth-middleware.interface';

@singleton()
export class ValidationProvider {
  validate(schema: zod.ZodObject) {
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
      try {
        req.body = await schema.parseAsync(req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
