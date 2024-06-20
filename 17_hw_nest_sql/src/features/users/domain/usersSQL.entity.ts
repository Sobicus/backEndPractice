import { randomUUID } from 'crypto';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import { add } from 'date-fns';

export class EmailConfirmationSQL {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;

  constructor() {
    (this.confirmationCode = randomUUID()),
      (this.expirationDate = add(new Date(), {
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
      })),
      (this.isConfirmed = false);
  }
}

export class UsersSQL {
  login: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;

  constructor(
    inputModel: UserInputModelType,
    passwordSalt: string,
    passwordHash: string,
  ) {
    (this.login = inputModel.login),
      (this.email = inputModel.email),
      (this.passwordSalt = passwordSalt),
      (this.passwordHash = passwordHash),
      (this.createdAt = new Date().toISOString());
  }
}
