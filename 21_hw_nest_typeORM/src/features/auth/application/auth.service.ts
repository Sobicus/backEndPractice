import { Injectable } from '@nestjs/common';
import { LoginInputModelType } from '../api/models/input/auth-.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';

import bcrypt from 'bcrypt';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { Users } from '../../users/domain/users.entity';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async checkCredentials(
    loginDTO: LoginInputModelType,
  ): Promise<ObjectClassResult<Users | null>> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginDTO.loginOrEmail,
    );
    if (!user) {
      return {
        status: statusType.Unauthorized,
        statusMessages: 'login/email/password has been incorrect',
        data: null,
      };
    }
    const passwordHash = await this._generateHash(
      loginDTO.password,
      user.passwordSalt,
    );
    if (passwordHash !== user.passwordHash) {
      return {
        status: statusType.Unauthorized,
        statusMessages: 'login/email/password has been incorrect',
        data: null,
      };
    }
    return {
      status: statusType.Success,
      statusMessages: 'User has been found',
      data: user,
    };
  }
  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
