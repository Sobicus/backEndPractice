import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { RegistrationUserModelType } from '../api/models/input/auth-.input.model';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { EmailService } from '../../../base/mail/email-server.service';

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
}
