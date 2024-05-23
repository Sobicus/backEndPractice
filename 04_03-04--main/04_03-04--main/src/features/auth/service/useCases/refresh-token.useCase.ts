import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionDocument } from '../../../security/repository/seesion.schema';
import { SessionRepository } from '../../../security/repository/session.repository';
import { AuthService } from '../auth.service';

export class RefreshTokenCommand {
  constructor(
    public userId: string,
    public tokenKey: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    protected sessionRepository: SessionRepository,
    protected authService: AuthService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<{ token: string; refreshToken: string }> {
    const { userId, tokenKey } = command;
    const session: SessionDocument = await this.findSession(userId, tokenKey);
    const newTokenKey = crypto.randomUUID();
    const deviceId = session.deviceId;
    await this.updateAndSaveSession(session, newTokenKey);
    return this.authService.generateTokenPair(userId, newTokenKey, deviceId);
  }

  async findSession(userId: string, tokenKey: string): Promise<SessionDocument> {
    const session = await this.sessionRepository.getByUserIdAndTokenKey(userId, tokenKey);
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async updateAndSaveSession(session: SessionDocument, newTokenKey: string): Promise<void> {
    session.updateSession(newTokenKey);
    await this.sessionRepository.saveSession(session);
  }
}
