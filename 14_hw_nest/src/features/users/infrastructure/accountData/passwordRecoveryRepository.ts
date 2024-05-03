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
  async savePasswordRecovery(passwordRecoveryModel: PasswordRecovery) {
    await this.PasswordRecoveryModel.create(passwordRecoveryModel);
  }
}
