import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { statusType } from '../../../../base/oject-result';

export class DeleteDeviceSessionCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceSessionCommand)
export class DeleteDeviceSessionHandler
  implements ICommandHandler<DeleteDeviceSessionCommand>
{
  constructor(private sessionRepository: SessionsRepository) {}

  async execute(command: DeleteDeviceSessionCommand) {
    const deviceSessionByDeviceId =
      await this.sessionRepository.findSessionByDeviceId(command.deviceId);

    if (!deviceSessionByDeviceId) {
      return {
        status: statusType.NotFound,
        statusMessages: 'DeviceSession has benn not found',
        data: null,
      };
    }
    if (command.userId !== deviceSessionByDeviceId.userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'Is not your deviceSession',
        data: null,
      };
    }
    await this.sessionRepository.deleteSession(
      command.userId,
      command.deviceId,
    );
    return {
      status: statusType.OK,
      statusMessages: 'DeviceSession has been deleted successfully',
      data: null,
    };
  }
}
