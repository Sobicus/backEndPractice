import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionsRepository } from '../../infrastructure/sessions.repository';

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
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionCommand) {
    await this.sessionRepository.deleteSession(
      Number(command.userId),
      command.deviceId,
    );
  }
}
