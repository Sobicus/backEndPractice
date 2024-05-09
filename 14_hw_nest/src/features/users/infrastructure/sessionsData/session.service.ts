import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions-repository';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

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
  ) {
    console.log('refreshToken', refreshToken);
    console.log('deviceName', deviceName);
    console.log('ip', ip);
    console.log('decode', await this.jwtService.decode(refreshToken));
    console.log(
      'verify',
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      }),
    );
    return;
  }
}
