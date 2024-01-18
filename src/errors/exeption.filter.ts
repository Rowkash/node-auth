import { NextFunction, Request, Response } from 'express'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { inject, injectable } from 'inversify'
import { IExceptionFilter } from './exception.filter.interface'
import { HttpError } from './http-error.class'
import 'reflect-metadata'

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
	}


	catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction) {
		if (error instanceof HttpError) {
			console.log('Exception if')
			this.logger.error(`[${error.context}] Error ${error.statusCode} : ${error.message}`)
			res.status(error.statusCode).send({ error: error.message })
		} else {

			this.logger.error(`[${error.message}`)
			res.status(500).send({ error: 'Internal Server Error' })
		}
	}
}