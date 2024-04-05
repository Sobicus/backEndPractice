import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from '../repositories/userRepository';
import { User, UsersDocument } from '../repositories/users-schema';
import { UserCreateModel } from '../types/input';
import { UserOutputType } from '../types/output';

@Injectable()
export class UserService {
  constructor(protected usersRepository: UserRepository) {}
  async createUserToDto(userData: UserCreateModel): Promise<UserOutputType> {
    const newUserInDb = await this.createUser(userData);
    return newUserInDb.toDto();
  }

  async createUser(userData: UserCreateModel): Promise<UsersDocument> {
    const passwordHash = await bcrypt.hash(userData.password, 12);
    const newUser = new User(userData, passwordHash);
    return this.usersRepository.addUser(newUser);
  }

  async checkCredentials(loginOrEmail: string, password: string): Promise<UsersDocument | null> {
    const user: UsersDocument | null = await this.usersRepository.getByLoginOrEmail(loginOrEmail);
    if (user && (await bcrypt.compare(password, user.accountData.passwordHash))) {
      return user;
    }
    return null;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.usersRepository.deleteUserById(userId);
  }
}
