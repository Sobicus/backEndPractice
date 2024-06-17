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

    return id;
  }

  async getUserById(userId: string): Promise<UsersSQL | null> {
    const user = await this.dataSource.query(
      `SELECT *
    FROM public."Users"
    WHERE "id"= $1`,
      [userId],
    );
    console.log(user);
    return user[0];
  }

  async removeUser(userId: string) {
    await this.dataSource.query(
      `DELETE FROM public."EmailConfirmation"
                WHERE "userId"= $1`,
      [userId],
    );
    await this.dataSource.query(
      `DELETE FROM public."Users"
                WHERE "id"= $1`,
      [userId],
    );
  }

  // async deleteAll() {
  //   await this.UsersModel.deleteMany();
  // }
  //
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersSQL | null> {
    const res = await this.dataSource.query(
      `SELECT *
    FROM public."Users"
    WHERE "login" = $1 or "email" = $1`,
      [loginOrEmail],
    );
    return res[0];
  }

  async findConfirmationCodeByUserId(userId: string): Promise<string | null> {
    const confirmationCode = await this.dataSource.query(
      `SELECT "confirmationCode"
FROM public."EmailConfirmation"
WHERE "userId"= $1`,
      [userId],
    );
    return confirmationCode[0].confirmationCode;
  }
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
