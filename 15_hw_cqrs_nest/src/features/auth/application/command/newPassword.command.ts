import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PasswordRecoveryRepository } from '../../../users/infrastructure/accountData/passwordRecoveryRepository';
import { InputNewPasswordModel } from '../../api/models/input/auth-.input.model';
import { UsersService } from '../../../users/application/users.service';

export class NewPasswordCommand {
  constructor(public data: InputNewPasswordModel) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private passwordRecoveryRepository: PasswordRecoveryRepository,
    private userService: UsersService,
  ) {}

  async execute(command: NewPasswordCommand) {
    const recoveryDTO =
      await this.passwordRecoveryRepository.findRecoveryCodeByCode(
        command.data.recoveryCode,
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
    await this.userService.changePassword(
      recoveryDTO.userId,
      command.data.newPassword,
    );
    return {
      status: statusType.OK,
      statusMessages: 'Password has been changed',
      data: null,
    };
  }
}
