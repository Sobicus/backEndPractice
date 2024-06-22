import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

export class FindActiveSessionCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(FindActiveSessionCommand)
export class FindActiveSessionHandler
  implements ICommandHandler<FindActiveSessionCommand>
{
  constructor(private sessionRepositorySQL: SessionsRepositorySQL) {}

  async execute(command: FindActiveSessionCommand) {
    return this.sessionRepositorySQL.getAllActiveSessions(command.userId);
  }
}
