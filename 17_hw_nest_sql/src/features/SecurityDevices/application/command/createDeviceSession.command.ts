import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

export class CreateDeviceSessionCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly deviceName: string,
    public readonly ip: string,
  ) {}
}

@CommandHandler(CreateDeviceSessionCommand)
export class CreateDeviceSessionHandler
  implements ICommandHandler<CreateDeviceSessionCommand>
{
  constructor(
    private sessionRepositorySQL: SessionsRepositorySQL,
    private jwtService: JwtService,
  ) {}

  async execute(command: CreateDeviceSessionCommand) {
    const { refreshToken, deviceName, ip } = command;
    const { userId, deviceId, iat } = this.jwtService.decode(refreshToken);
    const issuedAt = new Date(iat * 1000).toISOString();
    const newSession = { issuedAt, deviceId, ip, deviceName, userId };
    await this.sessionRepositorySQL.createDeviceSession(newSession);
  }
}
