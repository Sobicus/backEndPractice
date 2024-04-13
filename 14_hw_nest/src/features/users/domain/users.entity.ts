import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  passwordSalt: string;
  @Prop({ type: String, required: true })
  passwordHash: string;
  @Prop({ type: String, required: true })
  createdAt: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
