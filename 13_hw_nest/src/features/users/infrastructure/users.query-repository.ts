import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../domain/users.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  UserOutputDTO,
  UsersOutputDTO,
} from '../api/models/output/users.output.module';
import { PaginationUsersOutModelType } from '../../../base/pagination-users-helper';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(Users.name) private UsersModel: Model<Users>) {}

  async getAllUsers(
    pagination: PaginationUsersOutModelType,
  ): Promise<UsersOutputDTO> {
    const filter = {
      $or: [
        { login: { $regex: pagination.searchLoginTerm ?? '', $options: 'i' } },
        { email: { $regex: pagination.searchEmailTerm ?? '', $options: 'i' } },
      ],
    };
    const users = await this.UsersModel.find(filter)
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allUsers = users.map((u) => ({
      id: u._id.toString(),
      login: u.login,
      email: u.email,
      createdAt: u.createdAt,
    }));
    const totalCount = await this.UsersModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: allUsers,
    };
  }
  async getUserById(userId: string): Promise<UserOutputDTO | null> {
    const user = await this.UsersModel.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
