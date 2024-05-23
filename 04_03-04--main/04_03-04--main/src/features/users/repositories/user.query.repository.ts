import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { PaginationWithItems } from '../../common/types/output';
import { UserOutputType } from '../types/output';
import { User, UsersDocument } from './users-schema';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UsersDocument>,
  ) {}

  async findAll(sortData: QueryPaginationResult): Promise<PaginationWithItems<UserOutputType>> {
    const filter: FilterQuery<User> = {
      $or: [
        { 'accountData.email': { $regex: sortData.searchEmailTerm ?? '', $options: 'i' } },
        { 'accountData.login': { $regex: sortData.searchLoginTerm ?? '', $options: 'i' } },
      ],
    };

    const sortFilter: FilterQuery<User> = {
      [`accountData.${sortData.sortBy}`]: sortData.sortDirection,
    };
    const allUsers: UsersDocument[] = await this.UserModel.find(filter)
      .sort(sortFilter)
      .skip((+sortData.pageNumber - 1) * +sortData.pageSize)
      .limit(+sortData.pageSize);

    const allDtoUsers: UserOutputType[] = allUsers.map((user) => user.toDto());
    const totalCount: number = await this.UserModel.countDocuments(filter);
    return new PaginationWithItems(+sortData.pageNumber, +sortData.pageSize, totalCount, allDtoUsers);
  }

  async getUserById(userId: string): Promise<UserOutputType | null> {
    const user = await this.UserModel.findById(userId);
    if (!user) return null;
    return user.toDto();
  }
}
