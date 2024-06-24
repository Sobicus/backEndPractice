import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

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
  constructor(private sessionsRepositorySQL: SessionsRepositorySQL) {}

  async execute(command: DeleteDeviceSessionCommand) {
    const deviceSessionByDeviceId =
      await this.sessionsRepositorySQL.findSessionByDeviceId(command.deviceId);
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
      command.userId !== deviceSessionByDeviceId.userId,
    );
    console.log('command.userId ', command.userId);
    console.log(
      'deviceSessionByDeviceId.userId',
      deviceSessionByDeviceId.userId,
    );
    if (command.userId != deviceSessionByDeviceId.userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'Is not your deviceSession',
        data: null,
      };
    }
    await this.sessionsRepositorySQL.deleteSession(
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
