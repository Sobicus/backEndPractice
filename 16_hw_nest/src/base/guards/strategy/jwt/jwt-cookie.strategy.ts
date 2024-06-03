import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { SessionsRepository } from '../../../../features/auth/infrastructure/sessions.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(private readonly sessionsRepository: SessionsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ userId, deviceId }: { userId: string; deviceId: string }) {
    const session =
      await this.sessionsRepository.findSessionByUserIdAndDeviceId(
        userId,
        deviceId,
      );
    if (!session) {
      throw new UnauthorizedException();
    }
    return { userId, deviceId };
  }
}
