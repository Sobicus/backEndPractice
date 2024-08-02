import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

export class UpdateSessionCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly refreshToken: string,
  ) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(
    private sessionRepository: SessionsRepository,
    private jwtService: JwtService,
  ) {}

  async execute(command: UpdateSessionCommand) {
    const decodeJwtRefreshToken = await this.jwtService.decode(
      command.refreshToken,
    );
    const iat = decodeJwtRefreshToken['iat'];
    const issuedAt = new Date(iat * 1000).toISOString();
    await this.sessionRepository.updateSession(
      Number(command.userId),
      command.deviceId,
      issuedAt,
    );
  }
}
