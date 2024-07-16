import { Injectable } from '@nestjs/common';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import bcrypt from 'bcrypt';
import { EmailConfirmation, Users } from '../domain/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(inputModel: UserInputModelType): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );
    const user = new Users(inputModel, passwordSalt, passwordHash);
    const emailConfirmation = new EmailConfirmation();
    return this.usersRepository.createUser(user, emailConfirmation);
  }

  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
