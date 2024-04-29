import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import bcrypt from 'bcrypt';
import { UsersDocument } from '../domain/users.entity';
import { LoginInputModelType } from '../../auth/api/models/input/auth-.input.model';
import { EmailService } from '../../../base/mail/email-server.service';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

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
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          days: 1,
          hours: 1,
          minutes: 1,
          seconds: 1,
        }),
        isConfirmed: false,
      },
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
    await this.usersRepository.removeUser(userId);
    return {
      status: statusType.Success,
      statusMessages: 'User has been delete',
      data: null,
    };
  }

  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }

  async checkCredentials(
    loginDTO: LoginInputModelType,
  ): Promise<ObjectClassResult<UsersDocument | null>> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginDTO.loginOrEmail,
    );
    console.log('user in checkCredentials ', user);
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
}
