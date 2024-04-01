import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async createUser(inputModel: UserInputModelType): Promise<string> {
    const createdAt = new Date().toISOString();
    return await this.usersRepository.createUser({ ...inputModel, createdAt });
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
}
