import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

import { ConfigurationType } from '../../config/configuration';
config();

@Injectable()
export class JWTService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationType, true>,
  ) {}

  async createJWT(userId: string, deviceId: string) {
    const secretKey = this.configService.get('JwtSettings.JWT_SECRET', {
      infer: true,
    });
    if (!secretKey) {
      throw new Error('Invalid JWT_SECRET');
    }
    return {
      accessToken: await this.jwtService.signAsync(
        { userId },
        {
          secret: secretKey,
          expiresIn: '600m',
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { userId, deviceId },
        {
          secret: process.env.JWT_SECRET || '123',
          expiresIn: '600m',
        },
      ),
    };
  }
}
