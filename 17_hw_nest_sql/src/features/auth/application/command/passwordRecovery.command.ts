import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PasswordRecovery } from '../../domain/passwordRecovery.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PasswordRecoveryRepository } from '../../infrastructure/passwordRecovery.repository';
import { EmailService } from '../../../../base/mail/email-server.service';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private passwordRecoveryRepository: PasswordRecoveryRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const user = await this.usersRepository.findUserByEmail(command.email);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`t been found',
        data: null,
      };
    }
    const passwordRecovery = new PasswordRecovery(user._id.toString());
    await this.passwordRecoveryRepository.savePasswordRecovery(
      passwordRecovery,
    );
    await this.emailService.sendPasswordRecoveryCode(
      user.email,
      user.login,
      passwordRecovery.recoveryCode,
    );
    return {
      status: statusType.OK,
      statusMessages: 'Password recovery code has been sand',
      data: null,
    };
  }
}
