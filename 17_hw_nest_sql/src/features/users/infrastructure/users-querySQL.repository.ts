import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../domain/users.entity';
import { Model, Types } from 'mongoose';

import {
  UserAuthMeDTO,
  UserOutputDTO,
  UsersOutputDTO,
} from '../api/models/output/users.output.module';
import { PaginationUsersOutModelType } from '../../../base/helpers/pagination-users-helper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class usersQueryRepositorySQL {
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
    console.log('totalCount ', totalCount);
    const pagesCount = Math.ceil(totalCount[0].count / pagination.pageSize);
    console.log('pagesCount ', pagesCount);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: users,
    };
  }

  // async getUserById(userId: string): Promise<UserOutputDTO | null> {
  //   const user = await this.UsersModel.findOne({
  //     _id: new Types.ObjectId(userId),
  //   });
  //   if (!user) {
  //     return null;
  //   }
  //   return {
  //     id: user._id.toString(),
  //     login: user.login,
  //     email: user.email,
  //     createdAt: user.createdAt,
  //   };
  // }
  //
  // async getUserByIdForAuthMe(userId: string): Promise<null | UserAuthMeDTO> {
  //   console.log(userId);
  //   const user = await this.UsersModel.findOne({
  //     _id: new Types.ObjectId(userId),
  //   }).exec();
  //   if (!user) {
  //     return null;
  //   }
  //   return {
  //     email: user.email,
  //     login: user.login,
  //     userId: user._id.toString(),
  //   };
  // }
}
