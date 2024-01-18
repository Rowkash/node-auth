import { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'

@injectable()
export class PrismaService {
	client: PrismaClient

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient()
	}

	async connect() {
		try {
			await this.client.$connect()
			this.logger.log('[PrismaService] Successful connection to the Database')
		} catch (error) {
			if (error instanceof Error) this.logger.error('[PrismaService] Error connecting to Database: ' + error.message)
		}
	}

	async disconnect() {
		await this.client.$disconnect()
	}
}
