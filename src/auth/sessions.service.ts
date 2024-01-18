import { TYPES } from '../types'
import { inject, injectable } from 'inversify'
import { RedisService } from '../db/redis.service'
import { ISessions, IUserSession } from './interface/sessions.interface'

@injectable()
export class SessionsService implements ISessions {

	constructor(@inject(TYPES.RedisService) private redisService: RedisService) {
	}


	async getSessionByKey(key: string) {
		const session = await this.redisService.hGetAll(key)
		if (!session) return null
		return session
	}

	async createSession(key: string, value: IUserSession) {
		return await this.redisService.hSet(key, value)
	}

	async deleteSession(key: string) {
		return await this.redisService.del(key)
	}
}