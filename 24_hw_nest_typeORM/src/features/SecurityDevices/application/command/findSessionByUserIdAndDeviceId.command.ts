import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

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
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: FindSessionByUserIdAndDeviceIdCommand) {
    return this.sessionRepository.findSessionByUserIdAndDeviceId(
      Number(command.userId),
      command.deviceId,
    );
  }
}
