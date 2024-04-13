import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(inputModel: UserInputModelType): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );
    const createdAt = new Date().toISOString();
    const newUser = {
      login: inputModel.login,
      email: inputModel.email,
      passwordSalt,
      passwordHash,
      createdAt,
    };
    return await this.usersRepository.createUser(newUser);
  }

  async deleteUser(userId: string): Promise<ObjectClassResult> {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'User has not been found',
        data: null,
      };
    }
    await this.usersRepository.deleteUser(userId);
    return {
      status: statusType.Success,
      statusMessages: 'User has been delete',
      data: null,
    };
  }

  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
