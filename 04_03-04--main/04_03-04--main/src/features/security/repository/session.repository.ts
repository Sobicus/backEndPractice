/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SessionDb, SessionDocument } from './seesion.schema';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(SessionDb.name)
    private SeesionModel: Model<SessionDocument>,
  ) {}
  async addSession(session: SessionDb): Promise<void> {
    const newSession = new this.SeesionModel(session);
    await this.saveSession(newSession);
  }
  async sessionIsExist(userId: string, tokenKey: string): Promise<boolean> {
    const session = await this.SeesionModel.countDocuments({ userId: userId, tokenKey: tokenKey });
    return !!session;
  }
  async getByUserIdAndTokenKey(userId: string, tokenKey: string): Promise<SessionDocument | null> {
    return this.SeesionModel.findOne({ userId: userId, tokenKey: tokenKey });
  }
  async saveSession(session: SessionDocument): Promise<void> {
    await session.save();
  }
  async getByDeviceId(deviceId: string): Promise<SessionDocument | null> {
    return this.SeesionModel.findOne({ deviceId: deviceId });
  }
  async terminateCurrentSession(deviceId: string, userId: string): Promise<void> {
    await this.SeesionModel.findOneAndDelete({ deviceId: deviceId, userId: userId });
  }
  async terminateSessionWithTokenKey(userId: string, tokenKey: string): Promise<void> {
    await this.SeesionModel.findOneAndDelete({ userId: userId, tokenKey: tokenKey });
  }
  async terminateOtherSession(userId: string, tokenKey: string): Promise<void> {
    await this.SeesionModel.findOneAndDelete({ userId: userId, tokenKey: { $ne: tokenKey } });
  }
}
