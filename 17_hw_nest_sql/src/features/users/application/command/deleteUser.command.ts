import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.usersRepository.getUserById(command.userId);
    if (!user) {
      return {
        status: statusType.NotFound,
        statusMessages: 'User has not been found',
        data: null,
      };
    }
    await this.usersRepository.removeUser(command.userId);
    return {
      status: statusType.Success,
      statusMessages: 'User has been delete',
      data: null,
    };
  }
}
