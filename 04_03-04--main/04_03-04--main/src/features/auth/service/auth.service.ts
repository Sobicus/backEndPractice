/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService) {}
  async generateTokenPair(
    userId: string,
    tokenKey: string,
    deviceId: string,
  ): Promise<{ token: string; refreshToken: string }> {
    //TODO валидировать
    const tokenExpirationTime = process.env.TOKEN_EXP as string;
    const refreshTokenExpirationTime = process.env.REFRESH_TOKEN_EXP as string;
    const token = await this.createJwt({ userId }, tokenExpirationTime);
    const refreshToken = await this.createJwt({ userId, tokenKey, deviceId }, refreshTokenExpirationTime);
    return { token, refreshToken };
  }

  async createJwt(
    payload: {
      userId: string;
      tokenKey?: string;
      deviceId?: string;
    },
    expirationTime: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: `${expirationTime}s` });
  }
}
