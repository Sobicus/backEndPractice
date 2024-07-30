import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationUserModelType } from '../../api/models/input/auth-.input.model';
import { UsersService } from '../../../users/application/users.service';
import { EmailService } from '../../../../base/mail/email-server.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';

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
    const emailConfirmationDTO =
      await this.usersRepository.findEmailConfirmationByUserId(userId);
    await this.emailService.sendUserConfirmationCode(
      command.registrationDTO.email,
      command.registrationDTO.login,
      emailConfirmationDTO!.confirmationCode,
    );
  }
}
