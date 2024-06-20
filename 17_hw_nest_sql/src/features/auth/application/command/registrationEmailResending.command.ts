import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { EmailService } from '../../../../base/mail/email-server.service';
import { UsersRepositorySQL } from 'src/features/users/infrastructure/usersSQL.repository';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class RegistrationEmailResendingCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingHandler
  implements ICommandHandler<RegistrationEmailResendingCommand>
{
  constructor(
    private usersRepositorySQL: UsersRepositorySQL,
    private emailService: EmailService,
  ) {}

  async execute(command: RegistrationEmailResendingCommand) {
    const user =
      await this.usersRepositorySQL.findUserAndEmailConfirmationByEmail(
        command.email,
      );
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`n found',
        data: null,
      };
    }
    if (user.isConfirmed) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has been already confirmed',
        data: null,
      };
    }

    const updateConfirmationCode = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
      }),
    };
    await this.usersRepositorySQL.updateConfirmationCode(
      updateConfirmationCode,
    );
    await this.emailService.sendUserConfirmationCode(
      user.email,
      user.login,
      user.confirmationCode,
    );
    return {
      status: statusType.OK,
      statusMessages: 'registration code has been resending',
      data: null,
    };
  }
}
