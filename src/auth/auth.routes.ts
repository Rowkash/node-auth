import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { AuthController } from '@/auth/auth.controller';

@singleton()
export class AuthRoutes {
  private readonly _router: Router;

  constructor(@inject(AuthController) private controller: AuthController) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this._router.post('/login', this.controller.login.bind(this.controller));
    this._router.post(
      '/registration',
      this.controller.register.bind(this.controller),
    );
    this._router.post(
      '/refresh-tokens',
      this.controller.refreshTokens.bind(this.controller),
    );
    this._router.delete(
      '/logout',
      this.controller.logout.bind(this.controller),
    );
  }

  get router() {
    return this._router;
  }
}
