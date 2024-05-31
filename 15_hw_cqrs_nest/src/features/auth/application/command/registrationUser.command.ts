import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationUserModelType } from '../../api/models/input/auth-.input.model';
import { UsersService } from '../../../users/application/users.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../base/mail/email-server.service';

export class RegistrationUserCommand {
  constructor(public data: RegistrationUserModelType) {}
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
    const userId = await this.userService.createUser(command.data);
    const newUser = await this.usersRepository.getUserById(userId);
    await this.emailService.sendUserConfirmationCode(
      command.data.email,
      command.data.login,
      newUser!.emailConfirmation.confirmationCode,
    );
  }
}
