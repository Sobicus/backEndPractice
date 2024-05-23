import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../users/repositories/user.repository';
import { UsersDocument } from '../../../users/repositories/users-schema';

export class ChangeUserConfirmationCommand {
  constructor(
    public confCode: string,
    public confirmationStatus: boolean,
  ) {}
}

@CommandHandler(ChangeUserConfirmationCommand)
export class ChangeUserConfirmationUseCase implements ICommandHandler<ChangeUserConfirmationCommand> {
  constructor(protected userRepository: UserRepository) {}

  async execute(command: ChangeUserConfirmationCommand): Promise<void> {
    const { confCode, confirmationStatus } = command;
    const targetUser: UsersDocument | null = await this.userRepository.findByConfCode(confCode);
    if (!targetUser) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    targetUser.emailConfirmation.isConfirmed = confirmationStatus;
    //Delete the old validation code
    targetUser.emailConfirmation.confirmationCode = 'null';
    await this.userRepository.saveUser(targetUser);
  }
}
