import { Response, Request } from 'express';
import { singleton, inject } from 'tsyringe';
import { constants as statusCode } from 'http2';

import { UserService } from '@/users/users.service';
import { UserIdParamSchema } from '@/users/dto/user-params.dto';
import {
  AdminUserResponseSchema,
  BaseUserResponseSchema,
} from '@/users/dto/user-response.dto';
import {
  AdminUsersPageResponseSchema,
  AdminUsersPageSchema,
} from '@/users/dto/user-page.dto';
import { UpdateUserSchemaDto } from '@/users/dto/update-user.dto';

@singleton()
export class UserController {
  constructor(@inject(UserService) private service: UserService) {}

  async findById(req: Request, res: Response) {
    const { id } = UserIdParamSchema.parse(req.params);
    const result = await this.service.getOneOrFail({ id });
    return res
      .status(statusCode.HTTP_STATUS_OK)
      .json(AdminUserResponseSchema.parse(result));
  }

  async getSelfUser(req: Request, res: Response) {
    const result = await this.service.getOne({ id: req.user.id });
    return res.json(BaseUserResponseSchema.parse(result));
  }

  async getPage(req: Request, res: Response) {
    const query = AdminUsersPageSchema.parse(req.query);
    const result = await this.service.getPage(query);
    return res
      .status(statusCode.HTTP_STATUS_OK)
      .json(AdminUsersPageResponseSchema.parse(result));
  }

  async update(req: Request, res: Response) {
    const body = UpdateUserSchemaDto.parse(req.body);
    await this.service.update(req.user.id, body);
    return res.status(statusCode.HTTP_STATUS_NO_CONTENT).send();
  }
}
