/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';

import { SessionRepository } from '../../features/security/repository/session.repository';

@Injectable()
export class CookieJwtStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(private sessionRepository: SessionRepository) {
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

  async validate(payload: any) {
    const sessionId = await this.sessionRepository.sessionIsExist(payload.userId, payload.tokenKey);
    if (!sessionId) throw new UnauthorizedException();
    return { id: payload.userId, tokenKey: payload.tokenKey, deviceId: payload.deviceId };
  }
}
