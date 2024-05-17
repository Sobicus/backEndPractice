import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import {
  InputNewPasswordModel,
  LoginInputModelType,
  RegistrationUserModelType,
} from '../api/models/input/auth-.input.model';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { EmailService } from '../../../base/mail/email-server.service';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import { PasswordRecoveryRepository } from '../../users/infrastructure/passwordRecovery.repository';
import { PasswordRecovery } from '../../users/domain/passwordRecovery.entity';
import { UsersDocument } from '../../users/domain/users.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
    private passwordRecoveryRepository: PasswordRecoveryRepository,
  ) {}

  async registrationUsers(registrationDTO: RegistrationUserModelType) {
    const userId = await this.userService.createUser(registrationDTO);
    const newUser = await this.usersRepository.getUserById(userId);
    await this.emailService.sendUserConfirmationCode(
      registrationDTO.email,
      registrationDTO.login,
      newUser!.emailConfirmation.confirmationCode,
    );
  }

  async registrationConfirmation(code: string): Promise<ObjectClassResult> {
    const user = await this.usersRepository.findUserByCode(code);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`n found',
        data: null,
      };
    }
    user.emailConfirmation.confirmationCode = 'null';
    user.emailConfirmation.isConfirmed = true;
    await this.usersRepository.saveUser(user);
    return {
      status: statusType.Success,
      statusMessages: 'user has been confirmed',
      data: null,
    };
  }

  async registrationEmailResending(email: string): Promise<ObjectClassResult> {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`n found',
        data: null,
      };
    }
    if (user.emailConfirmation.isConfirmed) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has been already confirmed',
        data: null,
      };
    }
    user.updateConfirmationCode();
    await this.usersRepository.saveUser(user);
    await this.emailService.sendUserConfirmationCode(
      user.email,
      user.login,
      user.emailConfirmation.confirmationCode,
    );
    return {
      status: statusType.OK,
      statusMessages: 'registration code has been resending',
      data: null,
    };
  }

  async passwordRecovery(email: string): Promise<ObjectClassResult> {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`t been found',
        data: null,
      };
    }
    const passwordRecovery = new PasswordRecovery(user._id.toString());
    await this.passwordRecoveryRepository.savePasswordRecovery(
      passwordRecovery,
    );
    await this.emailService.sendPasswordRecoveryCode(
      user.email,
      user.login,
      passwordRecovery.recoveryCode,
    );
    return {
      status: statusType.OK,
      statusMessages: 'Password recovery code has been sand',
      data: null,
    };
  }
  async newPassword(
    newPasswordModel: InputNewPasswordModel,
  ): Promise<ObjectClassResult> {
    const recoveryDTO =
      await this.passwordRecoveryRepository.findRecoveryCodeByCode(
        newPasswordModel.recoveryCode,
      );
    if (!recoveryDTO) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Recovery code has been not valid',
        data: null,
      };
    }
    console.log(recoveryDTO.recoveryCodeExpireDate);
    console.log(new Date());
    console.log(recoveryDTO.recoveryCodeExpireDate < new Date());
    if (recoveryDTO.alreadyChangePassword) {
      return {
        status: statusType.TooManyRequests,
        statusMessages: 'Recovery code has been used already',
        data: null,
      };
    }
    if (recoveryDTO.recoveryCodeExpireDate < new Date()) {
      return {
        status: statusType.BadRequest,
        statusMessages: 'Recovery code has been expired',
        data: null,
      };
    }
    await this.userService.changePassword(
      recoveryDTO.userId,
      newPasswordModel.newPassword,
    );
    return {
      status: statusType.OK,
      statusMessages: 'Password has been changed',
      data: null,
    };
  }
  // NEW logic about passport local stategy------------------------------->>>>
  async checkCredentials(
    loginDTO: LoginInputModelType,
  ): Promise<ObjectClassResult<UsersDocument | null>> {
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
