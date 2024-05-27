import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from './sessions.repository';
import { SessionsDocument } from './sessions.entity';

@Injectable()
export class SessionService {
  constructor(
    private sessionRepository: SessionsRepository,
    private jwtService: JwtService,
  ) {}
  async createDeviceSession(
    refreshToken: string,
    deviceName: string,
    ip: string,
  ): Promise<void> {
    const decodeJwtRefreshToken = this.jwtService.decode(refreshToken);
    const userId: string = decodeJwtRefreshToken['userId'];
    const deviceId: string = decodeJwtRefreshToken['deviceId'];
    const iat: number = decodeJwtRefreshToken['iat'];
    const issuedAt = new Date(iat * 1000).toISOString();
    console.log('after decode decodeJwtRefreshToken', decodeJwtRefreshToken);
    console.log('after decode userId', userId);
    console.log('after decode deviceId', deviceId);
    console.log('after decode iat', iat);
    console.log('after decode issuedAt', issuedAt);
    console.log('after decode new Date', new Date(iat).toISOString());
    const newSession = { issuedAt, deviceId, ip, deviceName, userId };
    await this.sessionRepository.createDeviceSession(newSession);
  }
  async findSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<null | SessionsDocument> {
    return this.sessionRepository.findSessionByUserIdAndDeviceId(
      userId,
      deviceId,
    );
  }
  async deleteSession(userId: string, deviceId: string): Promise<void> {
    await this.sessionRepository.deleteSession(userId, deviceId);
  }
  async updateSession(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const decodeJwtRefreshToken = await this.jwtService.decode(refreshToken);
    const iat = decodeJwtRefreshToken['iat'];
    const issuedAt = new Date(iat * 1000).toISOString();
    return await this.sessionRepository.updateSession(
      userId,
      deviceId,
      issuedAt,
    );
  }
}
