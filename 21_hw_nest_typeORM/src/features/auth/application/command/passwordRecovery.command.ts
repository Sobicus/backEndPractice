import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { EmailService } from '../../../../base/mail/email-server.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { PasswordRecovery } from '../../domain/passwordRecovery.entity';
import { PasswordRecoveryRepository } from '../../infrastructure/passwordRecovery.repository';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private usersRepositorySQL: UsersRepository,
    private passwordRecoveryRepositorySQL: PasswordRecoveryRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const user = await this.usersRepositorySQL.findUserByEmail(command.email);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'user has`t been found',
        data: null,
      };
    }
    const passwordRecovery = new PasswordRecovery(user._id.toString());
    await this.passwordRecoveryRepositorySQL.createPasswordRecovery(
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
