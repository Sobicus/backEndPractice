import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { SessionDocument } from '../repository/seesion.schema';
import { SessionRepository } from '../repository/session.repository';

// Custom guard
// https://docs.nestjs.com/guards
@Injectable()
export class SessionOwnerGuard implements CanActivate {
  constructor(private sessionRepository: SessionRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const deviceId = request.params.id;
    const userId = request.user.id;
    const targetSession: SessionDocument = await this.getSession(deviceId);
    return this.chekCredentials(targetSession, userId);
  }
  async getSession(deviceId: string): Promise<SessionDocument> {
    const session = await this.sessionRepository.getByDeviceId(deviceId);
    if (!session) throw new NotFoundException();
    return session;
  }
  async chekCredentials(session: SessionDocument, userId: string): Promise<boolean> {
    if (session.userId !== userId) throw new ForbiddenException();
    return true;
  }
}
