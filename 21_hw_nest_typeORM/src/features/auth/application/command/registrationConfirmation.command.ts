import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class RegistrationConfirmationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationHandler
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private usersRepositorySQL: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const emailConfirmationDTO =
      await this.usersRepositorySQL.findEmailConfirmationByCode(command.code);
    if (!emailConfirmationDTO) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`n found',
        data: null,
      };
    }
    const changeEmailConfirmationStatus = {
      code: command.code,
      emailConfirmationCode: 'null',
      isConfirmed: true,
    };
    await this.usersRepositorySQL.changeEmailConfirmationStatus(
      changeEmailConfirmationStatus,
    );
    return {
      status: statusType.Success,
      statusMessages: 'user has been confirmed',
      data: null,
    };
  }
}
