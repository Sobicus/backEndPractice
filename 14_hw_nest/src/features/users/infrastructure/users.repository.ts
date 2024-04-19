import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from '../domain/users.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(Users.name) private UsersModel: Model<Users>) {}

  async getUserById(userId: string): Promise<Users | null> {
    return this.UsersModel.findOne({ _id: new ObjectId(userId) });
  }

  async createUser(userDTO: Users): Promise<string> {
    const user = await this.UsersModel.create(userDTO);
    return user._id.toString();
  }

  async deleteUser(userId: string) {
    return this.UsersModel.deleteOne({ _id: userId });
  }

  async deleteAll() {
    await this.UsersModel.deleteMany();
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UsersDocument | null> {
    return this.UsersModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }
}
