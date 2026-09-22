import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { AuthRoutes } from '@/auth/auth.routes';
import { UserRoutes } from '@/users/users.routes';
import { SessionsRoutes } from '@/sessions/sessions.routes';
import { HealthRouter } from '@/health/health.routes';

@singleton()
export class MainRouter {
  private readonly _router: Router;

  constructor(
    @inject(UserRoutes) private userRoutes: UserRoutes,
    @inject(AuthRoutes) private authRoutes: AuthRoutes,
    @inject(SessionsRoutes) private sessionRoutes: SessionsRoutes,
    @inject(HealthRouter) private healthRouter: HealthRouter,
  ) {
    this._router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this._router.use('/health', this.healthRouter.router);
    this._router.use('/auth', this.authRoutes.router);
    this._router.use('/sessions', this.sessionRoutes.router);
    this._router.use('/users', this.userRoutes.router);

    return this.router;
  }

  get router() {
    return this._router;
  }
}
