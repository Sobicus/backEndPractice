import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

export class DeleteSessionCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepositorySQL: SessionsRepositorySQL) {}

  async execute(command: DeleteSessionCommand) {
    await this.sessionRepositorySQL.deleteSession(
      command.userId,
      command.deviceId,
    );
  }
}
