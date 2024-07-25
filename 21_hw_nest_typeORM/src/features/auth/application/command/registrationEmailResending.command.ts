import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { EmailService } from '../../../../base/mail/email-server.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
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
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: RegistrationEmailResendingCommand) {
    const user = await this.usersRepository.findUserAndEmailConfirmationByEmail(
      command.email,
    );
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

    const updateConfirmationCode = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
      }),
      userId: user.id,
    };
    await this.usersRepository.updateConfirmationCode(updateConfirmationCode);
    await this.emailService.sendUserConfirmationCode(
      user.email,
      user.login,
      updateConfirmationCode.confirmationCode,
    );
    return {
      status: statusType.OK,
      statusMessages: 'registration code has been resending',
      data: null,
    };
  }
}
