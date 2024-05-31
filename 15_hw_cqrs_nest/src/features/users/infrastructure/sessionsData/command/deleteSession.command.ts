import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../sessions.repository';

export class DeleteSessionCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionCommand) {
    await this.sessionRepository.deleteSession(
      command.userId,
      command.deviceId,
    );
  }
}
