import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserInputModelType } from '../api/models/input/create-users.input.model';
import { EmailConfirmation } from '../domain/emailConfirmation.entity';
import { Users } from '../domain/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(inputModel: UserInputModelType): Promise<number> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );
    const user = Users.createUser(inputModel, passwordSalt, passwordHash);
    const userId = await this.usersRepository.saveUser(user);
    const emailConfirmation = EmailConfirmation.createEmailConfirmation(userId);

    await this.usersRepository.saveEmailConfirmation(emailConfirmation);
    return userId;
  }

  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
