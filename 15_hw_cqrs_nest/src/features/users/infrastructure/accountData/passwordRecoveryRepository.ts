import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordRecovery } from './passwordRecovery.entity';
import { Model } from 'mongoose';

@Injectable()
export class PasswordRecoveryRepository {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private PasswordRecoveryModel: Model<PasswordRecovery>,
  ) {}
  async savePasswordRecovery(
    passwordRecoveryModel: PasswordRecovery,
  ): Promise<void> {
    await this.PasswordRecoveryModel.create(passwordRecoveryModel);
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
