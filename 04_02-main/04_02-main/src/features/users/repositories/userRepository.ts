import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UsersDocument } from './users-schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UsersDocument>,
  ) {}
  /**
   * @returns id созданного блога
   * @param newUser : UsersDocument
   */
  async addUser(newUser: User): Promise<UsersDocument> {
    const newUserToDb = new this.UserModel(newUser);
    await newUserToDb.save();
    return newUserToDb;
  }

  async getByLoginOrEmail(logOrEmail: string): Promise<UsersDocument | null> {
    return this.UserModel.findOne({
      $or: [{ 'accountData.email': logOrEmail }, { 'accountData.login': logOrEmail }],
    });
  }
  async getUserById(userId: string): Promise<UsersDocument | null> {
    return this.UserModel.findById(userId);
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const deleteResult = await this.UserModel.findByIdAndDelete(userId);
    console.log(deleteResult);
    return !!deleteResult;
  }

  async findByConfCode(code: string): Promise<UsersDocument | null> {
    return this.UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }
  async saveUser(user: UsersDocument): Promise<void> {
    await user.save();
  }
}
