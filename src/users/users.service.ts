import { singleton, inject } from 'tsyringe';

import { Role } from '@/prisma/generated/enums';
import { UserRepository } from '@/users/users.repository';
import { PrismaService } from '@/db/prisma.service';
import {
  UserOrderByWithRelationInput,
  UserWhereInput,
} from '@/prisma/generated/models/User';
import { IGetUserOptions } from '@/users/interface/users.service.interface';
import { HttpError } from '@/errors/http-error.class';
import { TAdminUsersPageSchema } from '@/users/dto/user-page.dto';
import { SortingDbHelper } from '@/common/helpers/sorting.helper';

@singleton()
export class UserService {
  constructor(
    @inject(UserRepository) private repository: UserRepository,
    @inject(PrismaService) private prisma: PrismaService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    return this.repository.create(name, email, password);
  }

  async getOne(options: IGetUserOptions) {
    const where = this.buildFilter(options);
    const user = await this.prisma.client.user.findFirst({ where });
    if (!user) {
      throw new HttpError(404, 'User not found', 'UserService');
    }
    return user;
  }

  async deleteUserById(id: number) {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }
    return this.repository.delete(id);
  }

  async getUserByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async getUserById(id: number) {
    return this.repository.findById(id);
  }

  async getPage(options: TAdminUsersPageSchema) {
    const { limit, page, sortBy, orderSort, ...filter } = options;
    const where = this.buildFilter(filter);
    const sorting = new SortingDbHelper<UserOrderByWithRelationInput[]>(
      sortBy,
      orderSort,
    );

    const [models, count] = await Promise.all([
      this.prisma.client.user.findMany({
        orderBy: sorting.orderBy,
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.user.count({ where }),
    ]);

    return { models, count };
  }

  returnUserFields(userId: number, userEmail: string) {
    return { id: userId, email: userEmail };
  }

  async updateRole(id: number, role: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    const newRole = role as Role;
    return this.repository.updateRole(id, newRole);
  }

  buildFilter(options: IGetUserOptions): UserWhereInput {
    const filter: UserWhereInput = {};
    if (options.id != null) {
      filter.id = options.id;
    }
    if (options.email != null) {
      filter.email = {
        contains: options.email,
        mode: 'insensitive',
      };
    }

    if (options.name != null) {
      filter.name = {
        contains: options.name,
        mode: 'insensitive',
      };
    }

    return filter;
  }
}
