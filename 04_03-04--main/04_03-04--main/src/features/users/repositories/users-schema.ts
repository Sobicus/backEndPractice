/* eslint-disable no-underscore-dangle */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { HydratedDocument } from 'mongoose';

import { UserDbType } from '../types/input';
import { UserOutputType } from '../types/output';

// noinspection RegExpRedundantEscape
@Schema()
export class AccountData {
  @Prop({ required: true, minlength: 3, maxlength: 10 })
  login: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  createdAt: string;
}

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema()
export class EmailConfirmation {
  @Prop({ required: true }) confirmationCode: string;
  @Prop({ required: true }) expirationDate: Date;
  @Prop({ required: true }) isConfirmed: boolean;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class User {
  @Prop({ required: true }) _id: string;

  @Prop({ _id: false, required: true, type: AccountDataSchema })
  accountData: AccountData;

  @Prop({ _id: false, required: true, type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  constructor(userData: UserDbType, passwordHash: string) {
    this._id = crypto.randomUUID();
    this.accountData = {
      login: userData.login,
      email: userData.email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.emailConfirmation = {
      confirmationCode: crypto.randomUUID(),
      expirationDate: add(new Date(), {
        hours: 1,
      }),
      isConfirmed: false,
    };
  }
  toDto(): UserOutputType {
    return {
      id: this._id,
      login: this.accountData.login,
      email: this.accountData.email,
      createdAt: this.accountData.createdAt,
    };
  }

  updateConfirmationCode(): void {
    this.emailConfirmation.confirmationCode = crypto.randomUUID();
    this.emailConfirmation.expirationDate = add(new Date(), { hours: 1 });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
export type UsersDocument = HydratedDocument<User>;
