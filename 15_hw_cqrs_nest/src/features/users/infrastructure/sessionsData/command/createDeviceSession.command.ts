import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../sessions.repository';
import { JwtService } from '@nestjs/jwt';

export class CreateDeviceSessionCommand {
  constructor(
    public refreshToken: string,
    public deviceName: string,
    public ip: string,
  ) {}
}

@CommandHandler(CreateDeviceSessionCommand)
export class CreateDeviceSessionHandler
  implements ICommandHandler<CreateDeviceSessionCommand>
{
  constructor(
    private sessionRepository: SessionsRepository,
    private jwtService: JwtService,
  ) {}

  async execute(command: CreateDeviceSessionCommand) {
    const { refreshToken, ip, deviceName } = command;
    const decodeJwtRefreshToken = this.jwtService.decode(refreshToken);
    const userId: string = decodeJwtRefreshToken['userId'];
    const deviceId: string = decodeJwtRefreshToken['deviceId'];
    const iat: number = decodeJwtRefreshToken['iat'];
    const issuedAt = new Date(iat * 1000).toISOString();
    const newSession = { issuedAt, deviceId, ip, deviceName, userId };
    await this.sessionRepository.createDeviceSession(newSession);
  }
}
