import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from '../../../../features/SecurityDevices/infrastructure/sessions.repository';
import { Request } from 'express';
import { config } from 'dotenv';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(private readonly sessionsRepository: SessionsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '123',
    });
  }

  async validate({
    userId,
    deviceId,
    iat,
  }: {
    userId: string;
    deviceId: string;
    iat: string;
  }) {
    const issuedAt = new Date(+iat * 1000).toISOString();
    const session = await this.sessionsRepository.findSessionForCheckCokkie(
      userId,
      deviceId,
      issuedAt,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    return { userId, deviceId };
  }
}
