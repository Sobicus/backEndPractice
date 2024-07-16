import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class PasswordRecovery {
  userId: string;
  recoveryCode: string;
  recoveryCodeExpireDate: Date;
  alreadyChangePassword: boolean;

  constructor(userId: string) {
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
