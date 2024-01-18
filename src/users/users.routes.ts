import { Router } from 'express';
import { inject, singleton } from 'tsyringe';

import { UserController } from '@/users/users.controller';
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard';
import { Role } from '@/prisma/generated/enums';

@singleton()
export class UserRoutes {
  constructor(
    @inject(UserController) private controller: UserController,
    @inject(RolesAccessGuard) private rolesAccessGuard: RolesAccessGuard,
  ) {}

  initRoutes(router: Router) {
    router.get(
      '/users',
      this.rolesAccessGuard.handle([Role.ADMIN]),
      this.controller.getPage.bind(this.controller),
    );

    router.get(
      '/users/:id',
      this.rolesAccessGuard.handle([Role.ADMIN]),
      this.controller.findById.bind(this.controller),
    );

    // router.delete(
    //   '/users/:id',
    //   this.controller.deleteUserById.bind(this.controller),
    // );
    // router.patch(
    //   '/users/roles',
    //   this.controller.updateUserRole.bind(this.controller),
    // );
  }
}
