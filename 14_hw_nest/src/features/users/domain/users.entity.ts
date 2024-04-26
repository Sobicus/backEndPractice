import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EmailConfirmation {
  @Prop({ type: String, required: true })
  confirmationCode: string;
  @Prop({ type: Date, required: true })
  expirationDate: Date;
  @Prop({ type: Boolean, required: true })
  isConfirmed: boolean;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

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
  @Prop({ type: EmailConfirmationSchema, require: true, _id: false })
  emailConfirmation: EmailConfirmation;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

export type UsersDocument = HydratedDocument<Users>;
