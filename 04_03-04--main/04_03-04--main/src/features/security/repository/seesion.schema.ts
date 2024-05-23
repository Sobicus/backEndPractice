/* eslint-disable no-underscore-dangle */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { HydratedDocument } from 'mongoose';
import * as process from 'process';

import { SessionOutputType } from '../../auth/types/output';

@Schema()
export class SessionDb {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  tokenKey: string;

  @Prop({ required: true })
  issuedDate: string;

  @Prop({ required: true })
  expiredDate: Date;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  deviceId: string;
  constructor(tokenKey: string, devicId: string, title: string, userId: string, ip: string) {
    this._id = crypto.randomUUID();
    this.tokenKey = tokenKey;
    this.issuedDate = new Date().toISOString();
    this.expiredDate = add(new Date(), {
      seconds: Number(process.env.REFRESH_TOKEN_EXP),
    });
    this.title = title;
    this.userId = userId;
    this.ip = ip;
    this.deviceId = devicId;
  }
  toDto(): SessionOutputType {
    return {
      lastActiveDate: this.issuedDate,
      title: this.title,
      ip: this.ip,
      deviceId: this.deviceId,
    };
  }
  updateSession(newTokenKey: string): void {
    this.issuedDate = new Date().toISOString();
    this.tokenKey = newTokenKey;
  }
}
export const SessionSchema = SchemaFactory.createForClass(SessionDb);
SessionSchema.loadClass(SessionDb);
export type SessionDocument = HydratedDocument<SessionDb>;
