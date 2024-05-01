import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { UserInputModelType } from '../api/models/input/create-users.input.model';

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

  constructor(
    inputModel: UserInputModelType,
    passwordSalt: string,
    passwordHash: string,
  ) {
    (this.login = inputModel.login),
      (this.email = inputModel.email),
      (this.passwordSalt = passwordSalt),
      (this.passwordHash = passwordHash),
      (this.createdAt = new Date().toISOString()),
      (this.emailConfirmation = {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          days: 1,
          hours: 1,
          minutes: 1,
          seconds: 1,
        }),
        isConfirmed: false,
      });
  }

  updateConfirmationCode() {
    this.emailConfirmation.confirmationCode = randomUUID();
    this.emailConfirmation.expirationDate = add(new Date(), {
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.loadClass(Users);
export type UsersDocument = HydratedDocument<Users>;
