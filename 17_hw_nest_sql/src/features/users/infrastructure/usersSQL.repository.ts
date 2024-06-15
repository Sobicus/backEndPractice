import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { EmailConfirmationSQL, UsersSQL } from '../domain/usersSQL.entity';

@Injectable()
export class UsersRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(user: UsersSQL, emailConfirmation: EmailConfirmationSQL) {
    const userId = await this.dataSource.query(
      `INSERT INTO public."Users"(
      "login", "email", "passwordSalt", "passwordHash", "createdAt")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING "id";`,
      [
        user.login,
        user.email,
        user.passwordSalt,
        user.passwordHash,
        user.createdAt,
      ],
    );

    const id = userId[0].id;

    await this.dataSource.query(
      `INSERT INTO public."EmailConfirmation"(
      "userId", "confirmationCode", "expirationDate", "isConfirmed")
    VALUES ($1, $2, $3, $4)`,
      [
        id,
        emailConfirmation.confirmationCode,
        emailConfirmation.expirationDate,
        emailConfirmation.isConfirmed,
      ],
    );

    return userId;
  }
  //
  // async getUserById(userId: string): Promise<Users | null> {
  //   return this.UsersModel.findOne({ _id: new Types.ObjectId(userId) });
  // }
  //
  // async removeUser(userId: string) {
  //   await this.UsersModel.deleteOne({ _id: userId });
  // }
  //
  // async deleteAll() {
  //   await this.UsersModel.deleteMany();
  // }
  //
  // async findUserByLoginOrEmail(
  //   loginOrEmail: string,
  // ): Promise<UsersDocument | null> {
  //   return this.UsersModel.findOne({
  //     $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
  //   });
  // }
  //
  // async findUserByCode(code: string): Promise<UsersDocument | null> {
  //   return this.UsersModel.findOne({
  //     'emailConfirmation.confirmationCode': code,
  //   });
  // }
  //
  // async findUserByEmail(email: string): Promise<UsersDocument | null> {
  //   return this.UsersModel.findOne({ email });
  // }
  //
  // async changePassword(
  //   userId: string,
  //   passwordSalt: string,
  //   passwordHash: string,
  // ) {
  //   await this.UsersModel.updateOne({ userId }, { passwordSalt, passwordHash });
  // }
}
