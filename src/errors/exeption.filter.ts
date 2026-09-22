import { z as zod, ZodError } from 'zod';
import { singleton, inject } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { constants as statusCode } from 'http2';
import { STATUS_CODES } from 'http';

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
        return this.handleHttpError(error, res);
      case error instanceof ZodError:
        return this.handleZodError(error, res);
      case error instanceof SyntaxError:
        return this.handleSyntaxError(error, res);
      default:
        this.logger.error(error.message);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  handleHttpError(error: HttpError, res: Response) {
    this.logger.error(
      `[${error.context}] Error ${error.statusCode} : ${error.message}`,
    );

    res.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: STATUS_CODES[error.statusCode],
      details: error.message,
    });
  }

  handleZodError(error: ZodError, res: Response) {
    const formatErrors = zod.flattenError(error);
    let details = {};
    if (formatErrors.formErrors.length > 0) details = formatErrors.formErrors;
    if (Object.keys(formatErrors.fieldErrors).length != 0)
      details = formatErrors.fieldErrors;

    res.status(statusCode.HTTP_STATUS_BAD_REQUEST).json({
      statusCode: statusCode.HTTP_STATUS_BAD_REQUEST,
      message: 'Validation failed',
      details,
    });
  }

  handleSyntaxError(error: SyntaxError, res: Response) {
    return res.status(statusCode.HTTP_STATUS_BAD_REQUEST).json({
      statusCode: statusCode.HTTP_STATUS_BAD_REQUEST,
      message: 'Validation failed',
      details: error.message,
    });
  }
}
