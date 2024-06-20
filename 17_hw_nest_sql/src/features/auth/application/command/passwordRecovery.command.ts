import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PasswordRecovery } from '../../domain/passwordRecovery.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PasswordRecoveryRepository } from '../../infrastructure/passwordRecovery.repository';
import { EmailService } from '../../../../base/mail/email-server.service';
import { UsersRepositorySQL } from 'src/features/users/infrastructure/usersSQL.repository';
import { PasswordRecoverySQL } from '../../domain/passwordRecoverySQL.entity';
import { PasswordRecoveryRepositorySQL } from '../../infrastructure/passwordRecoverySQL.repository';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private usersRepositorySQL: UsersRepositorySQL,
    private passwordRecoveryRepositorySQL: PasswordRecoveryRepositorySQL,
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
    const passwordRecovery = new PasswordRecoverySQL(user._id.toString());
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
