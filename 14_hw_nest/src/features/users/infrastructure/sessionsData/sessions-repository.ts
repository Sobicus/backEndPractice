import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sessions } from './sessions.entity';
import { Model } from 'mongoose';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Sessions.name) private SessionsModel: Model<Sessions>,
  ) {}
  async createDeviceSession(
    issuedAt: string,
    deviceId: string,
    ip: string,
    deviceName: string,
    userId: string,
  ): Promise<boolean> {
    const newSession = { issuedAt, deviceId, ip, deviceName, userId };
    const result = await this.SessionsModel.create(newSession);
    console.log('newSession', newSession);
    console.log(
      'newSession  result._id !== undefined',
      result._id !== undefined,
    );
    return result._id !== undefined;
  }
}
