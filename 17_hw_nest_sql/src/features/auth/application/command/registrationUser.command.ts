import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationUserModelType } from '../../api/models/input/auth-.input.model';
import { UsersService } from '../../../users/application/users.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../base/mail/email-server.service';

export class RegistrationUserCommand {
  constructor(public readonly registrationDTO: RegistrationUserModelType) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserHandler
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private userService: UsersService,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: RegistrationUserCommand) {
    const userId = await this.userService.createUser(command.registrationDTO);
    const newUser = await this.usersRepository.getUserById(userId);
    await this.emailService.sendUserConfirmationCode(
      command.registrationDTO.email,
      command.registrationDTO.login,
      newUser!.emailConfirmation.confirmationCode,
    );
  }
}
