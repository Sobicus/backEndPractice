import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sessions, SessionsDocument } from '../domain/sessions.entity';
import { Model } from 'mongoose';
import { allActiveSessionViewType } from '../api/models/otput/sessions.output.module';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionsSQL } from '../domain/sessionsSQL.entity';

@Injectable()
export class SessionsRepositorySQL {
  constructor(
    @InjectModel(Sessions.name) private SessionsModel: Model<Sessions>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async createDeviceSession(newSession: SessionsSQL): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO public."Sessions"(
        "issuedAt", "deviceId", ip, "deviceName", "userId")
        VALUES ($1, $2, $3, $4, $5)`,
      [
        newSession.issuedAt,
        newSession.deviceId,
        newSession.ip,
        newSession.deviceName,
        newSession.userId,
      ],
    );
  }

  async findSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<null | SessionsSQL> {
    const session = await this.dataSource.query(
      `SELECT *
FROM public."Sessions"
WHERE "userId"=$1 and "deviceId"=$2`,
      [userId, deviceId],
    );
    return session[0];
  }

  async deleteSession(userId: string, deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM public."Sessions"
WHERE "userId"=$1 and "deviceId"=$2'`,
      [userId, deviceId],
    );
  }

  async updateSession(
    userId: string,
    deviceId: string,
    issuedAt: string,
  ): Promise<void> {
    await this.dataSource.query(
      `
UPDATE public."Sessions"
SET "issuedAt"=$3
WHERE "deviceId"=$2 and "userId"=$1`,
      [userId, deviceId, issuedAt],
    );
  }

  async getAllActiveSessions(
    userId: string,
  ): Promise<allActiveSessionViewType[]> {
    const sessions = await this.SessionsModel.find({ userId }).lean();
    const allSession = sessions.map((session) => {
      return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.issuedAt,
        deviceId: session.deviceId,
      };
    });
    return allSession;
  }

  async deleteDevicesExceptThis(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.SessionsModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
    return result.acknowledged;
  }

  async findSessionByDeviceId(deviceId: string): Promise<Sessions | null> {
    return this.SessionsModel.findOne({ deviceId }).lean();
  }

  async findSessionForCheckCokkie(
    userId: string,
    deviceId: string,
    issuedAt: string,
  ): Promise<null | SessionsDocument> {
    return this.SessionsModel.findOne({ userId, deviceId, issuedAt }).exec();
  }
  //--------------------
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Sessions"`);
  }
}
