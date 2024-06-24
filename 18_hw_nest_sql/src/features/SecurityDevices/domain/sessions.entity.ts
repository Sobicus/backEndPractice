import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Sessions {
  @Prop({ type: String, required: true })
  issuedAt: string;
  @Prop({ type: String, required: true })
  deviceId: string;
  @Prop({ type: String, required: true })
  ip: string;
  @Prop({ type: String, required: true })
  deviceName: string;
  @Prop({ type: String, required: true })
  userId: string;
}
export const SessionsSchema = SchemaFactory.createForClass(Sessions);

export type SessionsDocument = HydratedDocument<Sessions>;
