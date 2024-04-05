import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { PaginationWithItems } from '../../common/types/output';
import { QueryPagination } from '../../common/utils/queryPagination';
import { UserSortData } from '../types/input';
import { UserOutputType } from '../types/output';
import { User, UsersDocument } from './users-schema';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UsersDocument>,
  ) {}

  async findAll(sortData: UserSortData): Promise<PaginationWithItems<UserOutputType>> {
    const formattedSortData = QueryPagination.convertQueryPination(sortData);
    const filter: FilterQuery<User> = {
      $or: [
        { 'accountData.email': { $regex: formattedSortData.searchEmailTerm ?? '', $options: 'i' } },
        { 'accountData.login': { $regex: formattedSortData.searchLoginTerm ?? '', $options: 'i' } },
      ],
    };
    const sortFilter: FilterQuery<User> = {
      [`accountData.${formattedSortData.sortBy}`]: formattedSortData.sortDirection,
    };
    const allUsers: UsersDocument[] = await this.UserModel.find(filter)
      .sort(sortFilter)
      .skip((+formattedSortData.pageNumber - 1) * +formattedSortData.pageSize)
      .limit(+formattedSortData.pageSize);

    const allDtoUsers: UserOutputType[] = allUsers.map((user) => user.toDto());
    const totalCount: number = await this.UserModel.countDocuments(filter);
    return new PaginationWithItems(+formattedSortData.pageNumber, +formattedSortData.pageSize, totalCount, allDtoUsers);
  }
}
