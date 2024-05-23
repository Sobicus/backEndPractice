import { Controller, Delete, Get, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common';

import { CookieJwtGuard } from '../../../infrastructure/guards/jwt-cookie.guard';
import { CurrentSession } from '../../auth/decorators/userId-sessionKey.decorator';
import { SessionOutputType } from '../../auth/types/output';
import { SessionOwnerGuard } from '../guards/session-owner.guard';
import { SessionQueryRepository } from '../repository/session.query.repository';
import { SessionRepository } from '../repository/session.repository';

@Controller('security')
export class SecurityController {
  constructor(
    private sessionQueryRepository: SessionQueryRepository,
    private sessionRepository: SessionRepository,
  ) {} //protected authService: AuthService,

  @UseGuards(CookieJwtGuard)
  @Get('devices')
  @HttpCode(200)
  async getSessions(
    @CurrentSession() { userId }: { userId: string; tokenKey: string },
  ): Promise<SessionOutputType[] | null> {
    const sessions = await this.sessionQueryRepository.getUserSessions(userId);
    if (!sessions) throw new NotFoundException();
    return sessions;
  }
  @UseGuards(CookieJwtGuard, SessionOwnerGuard)
  @Delete('devices/:id')
  @HttpCode(204)
  async terminateCurrentSession(
    @CurrentSession() { userId }: { userId: string; tokenKey: string },
    @Param('id') deviceId: string,
  ): Promise<void> {
    await this.sessionRepository.terminateCurrentSession(deviceId, userId);
  }
  @UseGuards(CookieJwtGuard)
  @Delete('devices')
  @HttpCode(204)
  async terminateOtherSession(
    @CurrentSession() { userId, tokenKey }: { userId: string; tokenKey: string },
  ): Promise<void> {
    await this.sessionRepository.terminateOtherSession(userId, tokenKey);
  }
}
