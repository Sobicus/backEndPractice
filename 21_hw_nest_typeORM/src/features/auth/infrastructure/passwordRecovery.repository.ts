import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PasswordRecovery } from '../domain/passwordRecovery.entity';

@Injectable()
export class PasswordRecoveryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PasswordRecovery)
    protected passwordRecovery: Repository<PasswordRecovery>,
  ) {}

  async createPasswordRecovery(
    passwordRecoveryModel: PasswordRecovery,
  ): Promise<void> {
    await this.passwordRecovery.save(passwordRecoveryModel);
    // await this.dataSource.query(
    //   `INSERT INTO public."PasswordRecovery"(
    //   "userId", "recoveryCode", "recoveryCodeExpireDate", "alreadyChangePassword")
    // VALUES ($1, $2, $3, $4);`,
    //   [
    //     passwordRecoveryModel.recoveryCode,
    //     passwordRecoveryModel.recoveryCode,
    //     passwordRecoveryModel.recoveryCodeExpireDate,
    //     passwordRecoveryModel.alreadyChangePassword,
    //   ],
    // );
  }

  async findRecoveryCodeByCode(
    recoveryCode: string,
  ): Promise<null | PasswordRecovery> {
    return await this.passwordRecovery.findOne({ where: { recoveryCode } });
    //     const passwordRecoveryDTO = await this.dataSource.query(
    //       `
    // SELECT *
    // FROM public."PasswordRecovery"
    // WHERE "recoveryCode"= $1`,
    //       [recoveryCode],
    //     );
    //     return passwordRecoveryDTO[0];
  }

  //----------------------------------------------------------------------
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."PasswordRecovery"`);
  }
}
