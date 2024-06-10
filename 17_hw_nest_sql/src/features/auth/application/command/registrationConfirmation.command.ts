import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../users/application/users.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../base/mail/email-server.service';
import { statusType } from '../../../../base/oject-result';

export class RegistrationConfirmationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationHandler
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const user = await this.usersRepository.findUserByCode(command.code);
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
}
