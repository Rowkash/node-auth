import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { SessionsController } from '@/sessions/sessions.controller';

@singleton()
export class SessionsRoutes {
  private readonly _router: Router;

  constructor(
    @inject(SessionsController) private controller: SessionsController,
  ) {
    this._router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this._router.get('/:id', this.controller.getOne.bind(this.controller));
  }

  get router() {
    return this._router;
  }
}
