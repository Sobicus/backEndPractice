import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}
  async createJWT(userId: string, deviceId: string) {
    // const payload = { userId };
    return {
      accessToken: await this.jwtService.signAsync(
        { userId },
        {
          secret: process.env.JWT_SECRET || '123',
          expiresIn: '60s',
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { userId, deviceId },
        {
          secret: process.env.JWT_SECRET || '123',
          expiresIn: '60s',
        },
      ),
    };
  }
}
