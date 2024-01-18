import Redis, { RedisKey } from 'ioredis'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { inject, injectable } from 'inversify'

@injectable()
export class RedisService {
	client: Redis

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
	}

	async connect() {
		try {
			this.client = new Redis()
			this.logger.log('[RedisService] Successful connection Redis')
		} catch (error) {
			if (error instanceof Error) this.logger.error('[RedisService] Error connecting Redis: ' + error.message)
		}
	}

	async disconnect() {
		this.client.disconnect()
	}

	async hSet(key: RedisKey, obj: object) {
		return this.client.hset(key, obj)
	}

	async del(key: RedisKey) {
		return this.client.del(key)
	}

	async hGetAll(key: RedisKey) {
		return this.client.hgetall(key)
	}

	async hGet(key: RedisKey, field: string) {
		return this.client.hget(key, field)
	}

	async rename(key: RedisKey, newKey: RedisKey) {
		return this.client.rename(key, newKey)
	}

}