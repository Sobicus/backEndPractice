import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';

export class RegistrationConfirmationCommand {
  constructor(public data: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationHandler
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const user = await this.usersRepository.findUserByCode(command.data);
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
