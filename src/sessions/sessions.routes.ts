import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { SessionsController } from '@/sessions/sessions.controller';

@singleton()
export class SessionsRoutes {
  constructor(
    @inject(SessionsController) private controller: SessionsController,
  ) {}

  initRoutes(router: Router) {
    router.get('/sessions/:key', this.controller.getOne.bind(this.controller));
  }
}
