import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { AuthController } from '@/auth/auth.controller';

@singleton()
export class AuthRoutes {
  constructor(@inject(AuthController) private controller: AuthController) {}

  initRoutes(router: Router) {
    router.post('/auth/login', this.controller.login.bind(this.controller));
    router.post(
      '/auth/registration',
      this.controller.register.bind(this.controller),
    );
    router.post(
      '/auth/refresh-tokens',
      this.controller.refreshTokens.bind(this.controller),
    );
    router.delete('/auth/logout', this.controller.logout.bind(this.controller));
  }
}
