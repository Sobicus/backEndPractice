import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../sessions.repository';

export class FindSessionByUserAndDeviceIdsCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(FindSessionByUserAndDeviceIdsCommand)
export class FindSessionByUserAndDeviceIdsHandler
  implements ICommandHandler<FindSessionByUserAndDeviceIdsCommand>
{
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: FindSessionByUserAndDeviceIdsCommand) {
    return this.sessionRepository.findSessionByUserIdAndDeviceId(
      command.userId,
      command.deviceId,
    );
  }
}
