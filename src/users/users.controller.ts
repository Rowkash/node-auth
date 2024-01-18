import { singleton, inject } from 'tsyringe';
import { Response } from 'express';

import { UserService } from '@/users/users.service';
import { IAuthRequest } from '@/auth/interface/auth-middleware.interface';
import { userIdParamSchema } from '@/users/dto/user.dto';
import { AdminUserResponseSchema } from '@/users/dto/user-response.dto';
import {
  AdminUsersPageResponseSchema,
  AdminUsersPageSchema,
} from '@/users/dto/user-page.dto';

@singleton()
export class UserController {
  constructor(@inject(UserService) private service: UserService) {}

  async findById(req: IAuthRequest, res: Response) {
    const { id } = userIdParamSchema.parse(req.params);
    const result = await this.service.getOne({ id });
    return res.json(AdminUserResponseSchema.parse(result));
  }

  async getPage(req: IAuthRequest, res: Response) {
    const query = AdminUsersPageSchema.parse(req.query);
    const result = await this.service.getPage(query);
    return res.json(AdminUsersPageResponseSchema.parse(result));
  }

  // async deleteUserById(req: IAuthRequest, res: Response, next: NextFunction) {
  //   try {
  //     if (!req.user || req.user.role !== 'ADMIN')
  //       return next(new HttpError(403, 'Access denied'));
  //
  //     const { id } = req.params;
  //     const result = await this.service.deleteUserById(+id);
  //     if (!result) return next(new HttpError(404, 'User not found'));
  //
  //     return res.status(200).send();
  //   } catch (error) {
  //     return next(error);
  //   }
  // }

  // async updateUserRole(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { user, role } = req.body;
  //     const result = await this.service.updateRole(+user, role);
  //     if (!result) return next(new HttpError(404, 'User not found'));
  //
  //     return res.json(result);
  //   } catch (error) {
  //     return next(error);
  //   }
  // }
}
