import { TYPES } from './types'
import { App } from './app'

import { appContainer } from './config/inversify.config'

function bootstrap() {
	const app = appContainer.get<App>(TYPES.Application)
	app.init()
	return { appContainer, app }
}

export const boot = bootstrap()
