import { Injectable } from '@nestjs/common';

import {
  UserAuthMeDTO,
  UserOutputDTO,
  UsersOutputDTO,
} from '../api/models/output/users.output.module';
import { PaginationUsersOutModelType } from '../../../base/helpers/pagination-users-helper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAllUsers(
    pagination: PaginationUsersOutModelType,
  ): Promise<UsersOutputDTO> {
    // Убедитесь, что sortBy является допустимым идентификатором столбца
    const validSortColumns = ['id', 'login', 'email', 'createdAt']; // список допустимых столбцов для сортировки
    const sortBy = validSortColumns.includes(pagination.sortBy)
      ? `"${pagination.sortBy}"`
      : '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';

    const query = `
    SELECT u."id", u."login", u."email", u."createdAt"
    FROM public."Users" as u
    WHERE "login" ILIKE $1 OR "email" ILIKE $2
    ORDER BY ${sortBy} ${sortDirection}
    LIMIT $3 OFFSET $4
  `;

    const users = await this.dataSource.query(query, [
      `%${pagination.searchLoginTerm}%`,
      `%${pagination.searchEmailTerm}%`,
      pagination.pageSize,
      pagination.skip,
    ]);
    const totalCount = await this.dataSource.query(
      `SELECT count(*)
        FROM public."Users"
        WHERE "login" ILIKE $1 OR "email" ILIKE $2`,
      [`%${pagination.searchLoginTerm}%`, `%${pagination.searchEmailTerm}%`],
    );

    const formatTotalCount = totalCount[0].count;

    const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: formatTotalCount,
      items: users,
    };
  }

  async getUserById(userId: number): Promise<UserOutputDTO | null> {
    return await this.dataSource.query(
      `SELECT u."id", u."login", u."email", u."createdAt"
    FROM public."Users" as u
    WHERE "id"= $1`,
      [userId],
    );
  }

  async getUserByIdForAuthMe(userId: number): Promise<null | UserAuthMeDTO> {
    return await this.dataSource.query(
      `SELECT u."id", u."login", u."email"
    FROM public."Users" as u
    WHERE "id"= $1`,
      [userId],
    );
  }
}
