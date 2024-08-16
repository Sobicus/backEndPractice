import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

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
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteDeviceSessionCommand) {
    const deviceSessionByDeviceId =
      await this.sessionsRepository.findSessionByDeviceId(command.deviceId);
    console.log('deviceSessionByDeviceId', deviceSessionByDeviceId);
    console.log('!deviceSessionByDeviceId', !deviceSessionByDeviceId);
    if (!deviceSessionByDeviceId) {
      return {
        status: statusType.NotFound,
        statusMessages: 'DeviceSession has benn not found',
        data: null,
      };
    }
    console.log(
      'command.userId !== deviceSessionByDeviceId.userId',
      Number(command.userId) !== deviceSessionByDeviceId.userId,
    );
    console.log('command.userId ', command.userId);
    console.log(
      'deviceSessionByDeviceId.userId',
      deviceSessionByDeviceId.userId,
    );
    if (Number(command.userId) != deviceSessionByDeviceId.userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'Is not your deviceSession',
        data: null,
      };
    }
    await this.sessionsRepository.deleteSession(
      Number(command.userId),
      command.deviceId,
    );
    return {
      status: statusType.OK,
      statusMessages: 'DeviceSession has been deleted successfully',
      data: null,
    };
  }
}
