import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { UserController } from '@/users/users.controller';
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard';
import { UserRoleEnum } from '@/users/schemas/user.schema';

@singleton()
export class UserRoutes {
  private readonly _router: Router;

  constructor(
    @inject(UserController) private controller: UserController,
    @inject(RolesAccessGuard) private rolesAccessGuard: RolesAccessGuard,
  ) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      '/',
      this.rolesAccessGuard.handle([UserRoleEnum.ADMIN]),
      this.controller.getPage.bind(this.controller),
    );

    this._router.get(
      '/me',
      this.rolesAccessGuard.handle([UserRoleEnum.USER, UserRoleEnum.ADMIN]),
      this.controller.getSelfUser.bind(this.controller),
    );

    this._router.patch(
      '/me',
      this.rolesAccessGuard.handle([UserRoleEnum.USER, UserRoleEnum.ADMIN]),
      this.controller.update.bind(this.controller),
    );

    this._router.get(
      '/:id',
      this.rolesAccessGuard.handle([UserRoleEnum.ADMIN]),
      this.controller.findById.bind(this.controller),
    );
  }

  get router() {
    return this._router;
  }
}
