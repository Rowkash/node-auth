import { IConfigService } from './config.service.interface'
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { inject, injectable } from 'inversify'

@injectable()
export class ConfigService implements IConfigService {
	readonly config: DotenvParseOutput

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config()
		if (result.error) {
			this.logger.error('[ConfigService] The file ".env" could not be read or is missing')
		} else {
			this.logger.log('[ConfigService] Configuration ".env" loaded')
			this.config = result.parsed as DotenvParseOutput
		}

	}


	get<T extends number | string>(key: string): T {
		return this.config[key] as T
	}
}