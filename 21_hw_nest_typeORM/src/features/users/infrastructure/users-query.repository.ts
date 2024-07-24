import { Injectable } from '@nestjs/common';

import {
  UserAuthMeDTO,
  UserOutputDTO,
  UsersOutputDTO,
} from '../api/models/output/users.output.module';
import { PaginationUsersOutModelType } from '../../../base/helpers/pagination-users-helper';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Users } from '../domain/users.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users) protected userRepository: Repository<Users>,
  ) {}
  async getAllUsers(pagination: PaginationUsersOutModelType) {
    const validSortColumns = ['id', 'login', 'email', 'createdAt'];
    const sortBy = validSortColumns.includes(pagination.sortBy)
      ? pagination.sortBy
      : 'createdAt';
    const sortDirection = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';
    this.userRepository.createQueryBuilder();
    const [users, totalCount] = await this.userRepository.findAndCount({
      where: [
        { login: ILike(`%${pagination.searchLoginTerm}%`) },
        { email: ILike(`%${pagination.searchEmailTerm}%`) },
      ],
      order: { [sortBy]: sortDirection },
      take: pagination.pageSize,
      skip: pagination.skip,
    });

    const usersOfMapper = users.map((u) => ({
      id: u.id.toString(),
      login: u.login,
      email: u.email,
      createdAt: u.createdAt,
    }));

    const pagesCount = Math.ceil(totalCount / pagination.pageSize);

    return {
      pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount,
      items: usersOfMapper,
    };
  }

  // async getAllUsers(
  //   pagination: PaginationUsersOutModelType,
  // ): Promise<UsersOutputDTO> {
  //   // Убедитесь, что sortBy является допустимым идентификатором столбца
  //   const validSortColumns = ['id', 'login', 'email', 'createdAt']; // список допустимых столбцов для сортировки
  //   const sortBy = validSortColumns.includes(pagination.sortBy)
  //     ? `"${pagination.sortBy}"`
  //     : '"createdAt"';
  //   const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';
  //
  //   const query = `
  //   SELECT u."id", u."login", u."email", u."createdAt"
  //   FROM public."Users" as u
  //   WHERE "login" ILIKE $1 OR "email" ILIKE $2
  //   ORDER BY ${sortBy} ${sortDirection}
  //   LIMIT $3 OFFSET $4`;
  //
  //   const users = await this.dataSource.query(query, [
  //     `%${pagination.searchLoginTerm}%`,
  //     `%${pagination.searchEmailTerm}%`,
  //     pagination.pageSize,
  //     pagination.skip,
  //   ]);
  //   //todo как мапер типизировать
  //   //const usersOfMapper = userMappers(users);
  //   const usersOfMapper = users.map((u) => {
  //     return {
  //       id: u.id.toString(),
  //       login: u.login,
  //       email: u.email,
  //       createdAt: u.createdAt,
  //     };
  //   });
  //
  //   const totalCount = await this.dataSource.query(
  //     `SELECT CAST(count(*) as int)
  //       FROM public."Users"
  //       WHERE "login" ILIKE $1 OR "email" ILIKE $2`,
  //     [`%${pagination.searchLoginTerm}%`, `%${pagination.searchEmailTerm}%`],
  //   );
  //
  //   const formatTotalCount = totalCount[0].count;
  //
  //   const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);
  //
  //   return {
  //     pagesCount: pagesCount,
  //     page: pagination.pageNumber,
  //     pageSize: pagination.pageSize,
  //     totalCount: formatTotalCount,
  //     items: usersOfMapper,
  //   };
  // }

  async getUserById(userId: number): Promise<UserOutputDTO | null> {
    const user = await this.dataSource.query(
      `SELECT u."id", u."login", u."email", u."createdAt"
    FROM public."Users" as u
    WHERE "id"= $1`,
      [userId],
    );
    const userMapped = user.map((u) => {
      return {
        id: u.id.toString(),
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
      };
    });
    return userMapped[0];
  }

  async getUserByIdForAuthMe(userId: number): Promise<null | UserAuthMeDTO> {
    const user = await this.dataSource.query(
      `SELECT u."id", u."login", u."email"
    FROM public."Users" as u
    WHERE "id"= $1`,
      [userId],
    );
    const userMapped = user.map((u) => {
      return { userId: u.id.toString(), login: u.login, email: u.email };
    });
    return userMapped[0];
  }
}
// const userMappers = (user: any): UserOutputDTO => {
//   user.map((u) => {
//     return {
//       id: u.id.toString(),
//       login: u.login,
//       email: u.email,
//       createdAt: u.createdAt,
//     };
//   });
// };
