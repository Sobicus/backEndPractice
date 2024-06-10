import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

export class FindActiveSessionCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(FindActiveSessionCommand)
export class FindActiveSessionHandler
  implements ICommandHandler<FindActiveSessionCommand>
{
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: FindActiveSessionCommand) {
    return this.sessionRepository.getAllActiveSessions(command.userId);
  }
}
