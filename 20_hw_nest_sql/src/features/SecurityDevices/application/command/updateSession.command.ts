import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepositorySQL } from '../../infrastructure/sessionsSQL.repository';

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
    private sessionRepositorySQL: SessionsRepositorySQL,
    private jwtService: JwtService,
  ) {}

  async execute(command: UpdateSessionCommand) {
    const decodeJwtRefreshToken = await this.jwtService.decode(
      command.refreshToken,
    );
    const iat = decodeJwtRefreshToken['iat'];
    const issuedAt = new Date(iat * 1000).toISOString();
    await this.sessionRepositorySQL.updateSession(
      command.userId,
      command.deviceId,
      issuedAt,
    );
  }
}
