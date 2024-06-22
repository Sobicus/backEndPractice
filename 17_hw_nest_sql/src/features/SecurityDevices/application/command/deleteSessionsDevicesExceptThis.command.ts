import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

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
  constructor(private sessionRepositorySQL: SessionsRepositorySQL) {}

  async execute(command: DeleteSessionExceptThisCommand) {
    await this.sessionRepositorySQL.deleteDevicesExceptThis(
      command.userId,
      command.deviceId,
    );
  }
}
