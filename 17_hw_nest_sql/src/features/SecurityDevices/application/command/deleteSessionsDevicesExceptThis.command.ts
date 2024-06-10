import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

export class DeleteSessionExceptThisCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionExceptThisCommand)
export class DeleteSessionExceptThisHandler
  implements ICommandHandler<DeleteSessionExceptThisCommand>
{
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionExceptThisCommand) {
    await this.sessionRepository.deleteDevicesExceptThis(
      command.userId,
      command.deviceId,
    );
  }
}
