import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { HealthController } from '@/health/health.controller';

@singleton()
export class HealthRouter {
  constructor(@inject(HealthController) private controller: HealthController) {}

  initRoutes(router: Router) {
    router.get('/health/live', this.controller.check.bind(this.controller));
    router.get('/health/ready', this.controller.ready.bind(this.controller));
  }
}
