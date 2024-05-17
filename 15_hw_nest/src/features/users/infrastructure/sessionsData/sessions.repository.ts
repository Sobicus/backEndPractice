import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sessions, SessionsDocument } from './sessions.entity';
import { Model } from 'mongoose';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Sessions.name) private SessionsModel: Model<Sessions>,
  ) {}
  async createDeviceSession(newSession: Sessions): Promise<void> {
    await this.SessionsModel.create(newSession);
  }
  async findSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<null | SessionsDocument> {
    return this.SessionsModel.findOne({ userId, deviceId }).exec();
  }
  async deleteSession(userId: string, deviceId: string) {
    await this.SessionsModel.deleteOne({ userId, deviceId });
  }
  //Todo what we return???
  async updateSession(
    userId: string,
    deviceId: string,
    issuedAt: string,
  ): Promise<boolean> {
    const res = await this.SessionsModel.updateOne(
      { userId, deviceId },
      { $set: { issuedAt } },
    );
    return res.acknowledged;
  }
}
