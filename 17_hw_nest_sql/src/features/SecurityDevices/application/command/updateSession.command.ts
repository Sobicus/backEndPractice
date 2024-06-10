import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { JwtService } from '@nestjs/jwt';

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
    return await this.sessionRepository.updateSession(
      command.userId,
      command.deviceId,
      issuedAt,
    );
  }
}
