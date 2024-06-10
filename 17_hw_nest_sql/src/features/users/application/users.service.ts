import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import bcrypt from 'bcrypt';
import { Users } from '../domain/users.entity';

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
    return this.usersRepository.saveUser(user);
  }

  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }

  async changePassword(userId: string, newPassword: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);
    await this.usersRepository.changePassword(
      userId,
      passwordSalt,
      passwordHash,
    );
  }
}
