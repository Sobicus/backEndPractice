import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EmailService } from '../../../../base/mail/email-server.service';
import { statusType } from '../../../../base/oject-result';
import { PasswordRecovery } from '../../domain/passwordRecovery.entity';
import { PasswordRecoveryRepository } from '../../infrastructure/passwordRecovery.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

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
    const passwordRecovery = PasswordRecovery.createPasswordRecovery(user.id);
    await this.passwordRecoveryRepository.createPasswordRecovery(
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
