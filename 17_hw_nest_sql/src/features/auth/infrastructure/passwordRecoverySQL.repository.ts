import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordRecovery } from '../domain/passwordRecovery.entity';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PasswordRecoverySQL } from '../domain/passwordRecoverySQL.entity';

@Injectable()
export class PasswordRecoveryRepositorySQL {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private PasswordRecoveryModel: Model<PasswordRecovery>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async createPasswordRecovery(
    passwordRecoveryModel: PasswordRecoverySQL,
  ): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO public."PasswordRecovery"(
      "userId", "recoveryCode", "recoveryCodeExpireDate", "alreadyChangePassword")
    VALUES ($1, $2, $3, $4);`,
      [
        passwordRecoveryModel.recoveryCode,
        passwordRecoveryModel.recoveryCode,
        passwordRecoveryModel.recoveryCodeExpireDate,
        passwordRecoveryModel.alreadyChangePassword,
      ],
    );
  }

  async findRecoveryCodeByCode(
    recoveryCode: string,
  ): Promise<null | PasswordRecovery> {
    return this.PasswordRecoveryModel.findOne({ recoveryCode });
  }

  async deleteALl() {
    await this.PasswordRecoveryModel.deleteMany();
  }
}
