import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Users } from '../domain/users.entity';
import { EmailConfirmation } from '../domain/emailConfirmation.entity';
import { UsersEmailConfirmationOutputDTO } from '../api/models/output/users.output.module';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users) protected usersRepository: Repository<Users>,
    @InjectRepository(EmailConfirmation)
    protected emailConfirmationRepository: Repository<EmailConfirmation>,
  ) {}

  async saveUser(user: Users): Promise<number> {
    const newUser = await this.usersRepository.save(user);
    return newUser.id;
  }

  async saveEmailConfirmation(emailConfirmation: EmailConfirmation) {
    await this.emailConfirmationRepository.save(emailConfirmation);
  }

  async createUser(user: Users, emailConfirmation: EmailConfirmation) {
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

  async getUserById(userId: number): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }

  async removeUser(userId: number) {
    await this.emailConfirmationRepository.delete({ userId: userId });
    await this.usersRepository.delete({ id: userId });
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
    const res = await this.dataSource.query(
      `SELECT *
    FROM public."Users"
    WHERE "login" = $1 or "email" = $1`,
      [loginOrEmail],
    );
    return res[0];
  }

  async findEmailConfirmationByUserId(
    userId: number,
  ): Promise<EmailConfirmation | null> {
    return await this.emailConfirmationRepository.findOne({
      where: { userId },
    });
    //     const emailConfirmationDTO = await this.dataSource.query(
    //       `SELECT *
    // FROM public."EmailConfirmation"
    // WHERE "userId"= $1`,
    //       [userId],
    //     );
    //     //return confirmationCode[0].confirmationCode;
    //     return emailConfirmationDTO[0];
  }

  async findEmailConfirmationByCode(
    code: string,
  ): Promise<EmailConfirmation | null> {
    return await this.emailConfirmationRepository.findOne({
      where: { confirmationCode: code },
    });
    //     const emailConfirmationDTO = await this.dataSource.query(
    //       `SELECT *
    //     FROM public."EmailConfirmation"
    // WHERE "confirmationCode"=$1`,
    //       [code],
    //     );
    //     return emailConfirmationDTO[0];
  }

  async changeEmailConfirmationStatus(data: {
    code: string;
    emailConfirmationCode: string;
    isConfirmed: boolean;
  }): Promise<void> {
    await this.emailConfirmationRepository.update(
      { confirmationCode: data.code }, // Условие поиска
      {
        confirmationCode: data.emailConfirmationCode,
        isConfirmed: data.isConfirmed,
      }, // Обновляемые поля
    );
    //     await this.dataSource.query(
    //       `UPDATE public."EmailConfirmation"
    // SET "confirmationCode"=$2,  "isConfirmed"=$3
    // WHERE "confirmationCode"=$1`,
    //       [data.code, data.emailConfirmationCode, data.isConfirmed],
    //     );
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { email } });
    //     const user = await this.dataSource
    //       .query(
    //         `SELECT *
    // FROM public."Users"
    // WHERE "email" = $1`,
    //         [email],
    //       )
    //       .then((res) => res[0]);
    //     return user;
  }

  //todo: add return type
  async findUserAndEmailConfirmationByEmail(
    email: string,
  ): Promise<UsersEmailConfirmationOutputDTO | null> {
    const result = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.emailConfirmation', 'ec')
      .where('u.email = :email', { email })
      .getOne();

    return result;
    //     const result = await this.dataSource.query(
    //       `SELECT u.*, ec.*
    // FROM public."Users" as u
    // LEFT JOIN public."EmailConfirmation" as ec
    // ON u."id" = ec."userId"
    // WHERE u."email" = $1`,
    //       [email],
    //     );
    //     return result[0];
  }

  async updateConfirmationCode(updateConfirmationCode: {
    confirmationCode: string;
    expirationDate: Date;
    userId: number;
  }): Promise<void> {
    await this.emailConfirmationRepository.update(
      { userId: updateConfirmationCode.userId },
      {
        expirationDate: updateConfirmationCode.expirationDate,
        confirmationCode: updateConfirmationCode.confirmationCode,
      },
    );
    //     await this.dataSource.query(
    //       `UPDATE public."EmailConfirmation"
    // SET "confirmationCode"=$1, "expirationDate"=$2
    // WHERE "userId"=$3;`,
    //       [
    //         updateConfirmationCode.confirmationCode,
    //         updateConfirmationCode.expirationDate,
    //         updateConfirmationCode.userId,
    //       ],
    //     );
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
