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
  ): Promise<null | PasswordRecoverySQL> {
    const passwordRecoveryDTO = await this.dataSource.query(
      `
SELECT *
FROM public."PasswordRecovery"
WHERE "recoveryCode"= $1`,
      [recoveryCode],
    );
    return passwordRecoveryDTO[0];
  }

  //----------------------------------------------------------------------
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."PasswordRecovery"`);
  }
}
