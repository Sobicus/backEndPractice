import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../domain/users.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(Users.name) private UsersModel: Model<Users>) {}

  async getUserById(userId: string): Promise<Users | null> {
    return this.UsersModel.findOne({ _id: new Types.ObjectId(userId) });
  }

  async createUser(userDTO: Users): Promise<string> {
    const user = await this.UsersModel.create(userDTO);
    return user._id.toString();
  }

  async removeUser(userId: string) {
    await this.UsersModel.deleteOne({ _id: userId });
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

  async findUserByCode(code: string): Promise<Users | null> {
    console.log('code in repo', code);
    return this.UsersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }
}
