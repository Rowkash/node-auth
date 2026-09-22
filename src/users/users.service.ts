import { singleton, inject } from 'tsyringe';
import { and, count, eq, like, SQL } from 'drizzle-orm';
import { constants as statusCode } from 'http2';

import { HttpError } from '@/errors/http-error.class';
import { TAdminUsersPageSchema } from '@/users/dto/user-page.dto';
import { SortingDbHelper } from '@/common/helpers/sorting.helper';
import { DrizzleService } from '@/db/drizzle.service';
import {
  TUserInsertSchema,
  TUserSchema,
  usersTable,
} from '@/users/schemas/user.schema';
import { TUpdateUserDto } from '@/users/dto/update-user.dto';

@singleton()
export class UserService {
  constructor(@inject(DrizzleService) private drizzle: DrizzleService) {}

  async create(data: TUserInsertSchema) {
    const [user] = await this.drizzle.client
      .insert(usersTable)
      .values(data)
      .returning();
    return user;
  }

  async update(id: TUserSchema['id'], data: TUpdateUserDto) {
    await this.drizzle.client
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id));
  }

  async getOne(options: Partial<TUserSchema>) {
    const filter = this.buildFilter(options);
    const [user] = await this.drizzle.client
      .select()
      .from(usersTable)
      .where(and(...filter));

    return user;
  }

  async getOneOrFail(options: Partial<TUserSchema>) {
    const user = await this.getOne(options);
    if (!user) {
      throw new HttpError(
        statusCode.HTTP_STATUS_NOT_FOUND,
        'User not found',
        'UserService',
      );
    }

    return user;
  }

  async getPage(options: TAdminUsersPageSchema) {
    const { limit, page, sortBy, orderSort, ...filter } = options;
    const where = this.buildFilter(filter);
    const sorting = new SortingDbHelper(usersTable, sortBy, orderSort);
    const usersQuery = this.drizzle.client
      .select()
      .from(usersTable)
      .orderBy(sorting.orderBy)
      .where(and(...where))
      .limit(limit)
      .offset((page - 1) * limit);

    const totalCountQuery = this.drizzle.client
      .select({ total: count() })
      .from(usersTable)
      .where(and(...where));

    const [users, [{ total }]] = await Promise.all([
      usersQuery,
      totalCountQuery,
    ]);

    return { models: users, count: total };
  }

  buildFilter(options: Partial<TUserSchema>): SQL[] {
    const filter: SQL[] = [];

    if (options.id) {
      filter.push(eq(usersTable.id, options.id));
    }
    if (options.email) {
      filter.push(eq(usersTable.email, options.email));
    }
    if (options.name) {
      filter.push(like(usersTable.name, `%${options.name}%`));
    }
    return filter;
  }
}
