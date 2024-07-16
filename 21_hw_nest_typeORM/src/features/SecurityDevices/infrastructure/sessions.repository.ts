import { Injectable } from '@nestjs/common';
import { allActiveSessionViewType } from '../api/models/otput/sessions.output.module';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Sessions } from '../domain/sessions.entity';

@Injectable()
export class SessionsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createDeviceSession(newSession: Sessions): Promise<void> {
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
  ): Promise<null | Sessions> {
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
WHERE "userId"=$1 and "deviceId"=$2`,
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
    const sessions = await this.dataSource.query(
      `SELECT "issuedAt", "deviceId", "ip", "deviceName"
FROM public."Sessions"
WHERE "userId"=$1`,
      [userId],
    );
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

  async deleteDevicesExceptThis(userId: string, deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM public."Sessions"
WHERE "userId"=$1 and "deviceId"!=$2`,
      [userId, deviceId],
    );
  }

  async findSessionByDeviceId(deviceId: string): Promise<Sessions | null> {
    const session = await this.dataSource.query(
      `
SELECT *
 FROM public."Sessions"
WHERE "deviceId"=$1`,
      [deviceId],
    );
    return session[0];
  }

  async findSessionForCheckCookie(
    userId: string,
    deviceId: string,
    issuedAt: string,
  ): Promise<null> {
    console.log(userId, deviceId, issuedAt);
    const result = await this.dataSource.query(
      `SELECT *
 FROM public."Sessions" WHERE "userId"=$1 AND "deviceId"=$2 AND  "issuedAt"=$3`,
      [userId, deviceId, issuedAt],
    );
    return result[0];
  }
  //--------------------
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Sessions"`);
  }
}
