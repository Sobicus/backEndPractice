import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}
  async createJWT(userId: string) {
    const payload = { userId };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || '123',
        expiresIn: '60s',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || '123',
        expiresIn: '60s',
      }),
    };
  }
}
