import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { HealthController } from '@/health/health.controller';

@singleton()
export class HealthRouter {
  private readonly _router: Router;

  constructor(@inject(HealthController) private controller: HealthController) {
    this._router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this._router.get('/live', this.controller.check.bind(this.controller));
    this._router.get('/ready', this.controller.ready.bind(this.controller));
  }

  get router() {
    return this._router;
  }
}
