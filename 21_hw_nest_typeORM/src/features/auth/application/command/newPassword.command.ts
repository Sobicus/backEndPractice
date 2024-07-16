import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { InputNewPasswordModel } from '../../api/models/input/auth-.input.model';
import bcrypt from 'bcrypt';
import { PasswordRecoveryRepository } from '../../infrastructure/passwordRecovery.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class NewPasswordCommand {
  constructor(public readonly newPasswordModel: InputNewPasswordModel) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private passwordRecoveryRepositorySQL: PasswordRecoveryRepository,
    private usersRepositorySQL: UsersRepository,
  ) {}

  async execute(command: NewPasswordCommand) {
    const recoveryDTO =
      await this.passwordRecoveryRepositorySQL.findRecoveryCodeByCode(
        command.newPasswordModel.recoveryCode,
      );
    if (!recoveryDTO) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Recovery code has been not valid',
        data: null,
      };
    }
    if (recoveryDTO.alreadyChangePassword) {
      return {
        status: statusType.TooManyRequests,
        statusMessages: 'Recovery code has been used already',
        data: null,
      };
    }
    if (recoveryDTO.recoveryCodeExpireDate < new Date()) {
      return {
        status: statusType.BadRequest,
        statusMessages: 'Recovery code has been expired',
        data: null,
      };
    }
    await this.changePassword(
      recoveryDTO.userId,
      command.newPasswordModel.newPassword,
    );
    return {
      status: statusType.OK,
      statusMessages: 'Password has been changed',
      data: null,
    };
  }
  private async changePassword(userId: string, newPassword: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);
    await this.usersRepositorySQL.changePassword(
      userId,
      passwordSalt,
      passwordHash,
    );
  }
  private async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
