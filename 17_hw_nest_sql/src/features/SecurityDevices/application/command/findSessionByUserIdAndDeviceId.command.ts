import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

export class FindSessionByUserIdAndDeviceIdCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(FindSessionByUserIdAndDeviceIdCommand)
export class FindSessionByUserIdAndDeviceIdHandler
  implements ICommandHandler<FindSessionByUserIdAndDeviceIdCommand>
{
  constructor(private sessionRepositorySQL: SessionsRepositorySQL) {}

  async execute(command: FindSessionByUserIdAndDeviceIdCommand) {
    return this.sessionRepositorySQL.findSessionByUserIdAndDeviceId(
      command.userId,
      command.deviceId,
    );
  }
}
