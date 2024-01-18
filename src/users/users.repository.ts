import { singleton, inject } from 'tsyringe';

import { PrismaService } from '@/db/prisma.service';
import { Role } from '@/prisma/generated/enums';
import { UserWhereInput } from '@/prisma/generated/models/User';
import { IGetUserOptions } from '@/users/interface/users.service.interface';

@singleton()
export class UserRepository {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async create(name: string, email: string, password: string) {
    return this.prisma.client.user.create({
      data: { name: name, email: email, password: password },
    });
  }

  async delete(id: number) {
    return this.prisma.client.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.client.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.client.user.findUnique({ where: { id } });
  }

  async getAll() {
    return this.prisma.client.user.findMany();
  }

  async updateRole(id: number, role: Role) {
    return this.prisma.client.user.update({ where: { id }, data: { role } });
  }

  buildFilter(options: IGetUserOptions): UserWhereInput {
    const filter: UserWhereInput = {};
    if (options.id != null) {
      filter.id = options.id;
    }

    return filter;
  }
}
