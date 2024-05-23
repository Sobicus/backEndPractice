import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MailService } from '../../../../mail/mail.service';
import { UserRepository } from '../../../users/repositories/user.repository';
import { UsersDocument } from '../../../users/repositories/users-schema';

export class EmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase implements ICommandHandler<EmailResendingCommand> {
  constructor(
    protected mailService: MailService,
    protected userRepository: UserRepository,
  ) {}

  async execute(command: EmailResendingCommand): Promise<void> {
    const { email } = command;
    const targetUser: UsersDocument | null = await this.userRepository.getByLoginOrEmail(email);
    if (!targetUser) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    targetUser.updateConfirmationCode();
    await this.userRepository.saveUser(targetUser);

    await this.mailService.sendUserConfirmation(
      targetUser.accountData.email,
      targetUser.accountData.login,
      targetUser.emailConfirmation.confirmationCode,
    );
  }
}
