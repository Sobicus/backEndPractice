/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SessionOutputType } from '../../auth/types/output';
import { SessionDb, SessionDocument } from './seesion.schema';

@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectModel(SessionDb.name)
    private SesionModel: Model<SessionDocument>,
  ) {}
  async getUserSessions(userId: string): Promise<SessionOutputType[] | null> {
    const sessions: SessionDocument[] | null = await this.SesionModel.find({ userId });
    if (!sessions) return null;
    return sessions.map((s) => s.toDto());
  }
}
