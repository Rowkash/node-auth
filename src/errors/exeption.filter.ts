import { z as zod, ZodError } from 'zod';
import { singleton, inject } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/errors/http-error.class';
import { LoggerService } from '@/logger/logger.service';

@singleton()
export class ExceptionFilter {
  constructor(@inject(LoggerService) private logger: LoggerService) {}

  catch(
    error: Error | HttpError,
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    switch (true) {
      case error instanceof HttpError:
        this.handleHttpError(error, res);
        break;
      case error instanceof ZodError:
        this.handleZodError(error as ZodError<Record<string, any>>, res);
        break;
      default:
        this.logger.error(error.message);
        res.status(500).send({ error: 'Internal Server Error' });
        break;
    }
  }

  handleHttpError(error: HttpError, res: Response) {
    this.logger.error(
      `[${error.context}] Error ${error.statusCode} : ${error.message}`,
    );
    res.status(error.statusCode).send({ error: error.message });
  }

  handleZodError(error: ZodError<Record<string, any>>, res: Response) {
    const formatErrors = zod.treeifyError<Record<string, any>>(error);
    this.logger.warn(`[Validation] ${error.message}`);
    res.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      details: formatErrors?.properties ?? {},
    });
  }
}
