import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { statusType } from '../../../../base/oject-result';
import { EmailService } from '../../../../base/mail/email-server.service';

export class RegistrationEmailResendingCommand {
  constructor(public data: string) {}
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
    const user = await this.usersRepository.findUserByEmail(command.data);
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
