import { z as zod } from 'zod';
import { singleton } from 'tsyringe';
import { Response, Request, NextFunction } from 'express';

@singleton()
export class ValidationProvider {
  validate(schema: zod.ZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await schema.parseAsync(req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
