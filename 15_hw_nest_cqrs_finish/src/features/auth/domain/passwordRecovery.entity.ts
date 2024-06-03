import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

@Schema()
export class PasswordRecovery {
  @Prop({ type: ObjectId, required: true })
  _id: ObjectId;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  recoveryCode: string;
  @Prop({ type: String, required: true })
  recoveryCodeExpireDate: Date;
  @Prop({ type: Boolean, required: true })
  alreadyChangePassword: boolean;

  constructor(userId: string) {
    (this._id = new ObjectId()),
      (this.userId = userId),
      (this.recoveryCode = randomUUID()),
      (this.recoveryCodeExpireDate = add(new Date(), {
        hours: 3,
        minutes: 3,
        seconds: 3,
      }));
    this.alreadyChangePassword = false;
  }
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
PasswordRecoverySchema.loadClass(PasswordRecovery);
export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;
