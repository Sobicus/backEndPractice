import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { RegistrationUserModelType } from '../api/models/input/auth-.input.model';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { EmailService } from '../../../base/mail/email-server.service';
import { ObjectClassResult, statusType } from '../../../base/oject-result';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
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
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
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
}
