import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { AuthRoutes } from '@/auth/auth.routes';
import { UserRoutes } from '@/users/users.routes';
import { SessionsRoutes } from '@/sessions/sessions.routes';
import { HealthRouter } from '@/health/health.routes';

@singleton()
export class MainRouter {
  router: Router;

  constructor(
    @inject(UserRoutes) private userRoutes: UserRoutes,
    @inject(AuthRoutes) private authRoutes: AuthRoutes,
    @inject(SessionsRoutes) private sessionRoutes: SessionsRoutes,
    @inject(HealthRouter) private healthRouter: HealthRouter,
  ) {
    this.router = Router();
    this.initAllRoutes();
  }

  initAllRoutes() {
    this.userRoutes.initRoutes(this.router);
    this.authRoutes.initRoutes(this.router);
    this.sessionRoutes.initRoutes(this.router);
    this.healthRouter.initRoutes(this.router);

    return this.router;
  }
}
