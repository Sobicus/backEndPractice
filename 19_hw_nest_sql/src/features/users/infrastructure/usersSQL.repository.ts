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

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersSQL | null> {
    const res = await this.dataSource.query(
      `SELECT *
    FROM public."Users"
    WHERE "login" = $1 or "email" = $1`,
      [loginOrEmail],
    );
    return res[0];
  }

  async findEmailConfirmationByUserId(
    userId: string,
  ): Promise<EmailConfirmationSQL | null> {
    const emailConfirmationDTO = await this.dataSource.query(
      `SELECT *
FROM public."EmailConfirmation"
WHERE "userId"= $1`,
      [userId],
    );
    //return confirmationCode[0].confirmationCode;
    return emailConfirmationDTO[0];
  }

  async findEmailConfirmationByCode(
    code: string,
  ): Promise<EmailConfirmationSQL | null> {
    const emailConfirmationDTO = await this.dataSource.query(
      `SELECT *
    FROM public."EmailConfirmation"
WHERE "confirmationCode"=$1`,
      [code],
    );
    return emailConfirmationDTO[0];
  }

  async changeEmailConfirmationStatus(data: {
    code: string;
    emailConfirmationCode: string;
    isConfirmed: boolean;
  }): Promise<void> {
    await this.dataSource.query(
      `UPDATE public."EmailConfirmation"
SET "confirmationCode"=$2,  "isConfirmed"=$3
WHERE "confirmationCode"=$1`,
      [data.code, data.emailConfirmationCode, data.isConfirmed],
    );
  }

  async findUserByEmail(email: string) {
    const user = await this.dataSource
      .query(
        `SELECT *
FROM public."Users"
WHERE "email" = $1`,
        [email],
      )
      .then((res) => res[0]);
    return user;
  }

  async findUserAndEmailConfirmationByEmail(email: string) {
    const result = await this.dataSource.query(
      `SELECT u.*, ec.*
FROM public."Users" as u
LEFT JOIN public."EmailConfirmation" as ec
ON u."id" = ec."userId"
WHERE u."email" = $1`,
      [email],
    );
    return result[0];
  }

  async updateConfirmationCode(updateConfirmationCode: {
    confirmationCode: string;
    expirationDate: Date;
    userId: number;
  }) {
    await this.dataSource.query(
      `UPDATE public."EmailConfirmation"
SET "confirmationCode"=$1, "expirationDate"=$2
WHERE "userId"=$3;`,
      [
        updateConfirmationCode.confirmationCode,
        updateConfirmationCode.expirationDate,
        updateConfirmationCode.userId,
      ],
    );
  }
  async changePassword(
    userId: string,
    passwordSalt: string,
    passwordHash: string,
  ) {
    await this.dataSource.query(
      `UPDATE public."Users"
SET "passwordSalt"=$2, "passwordHash"=$3
WHERE "id"=$1;`,
      [userId, passwordSalt, passwordHash],
    );
  }

  //------------------------------------------------------
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."EmailConfirmation"`);
    await this.dataSource.query(`DELETE FROM public."Users"`);
  }
}
