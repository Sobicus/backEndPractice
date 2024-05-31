import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationUserModelType } from '../../api/models/input/auth-.input.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../base/mail/email-server.service';
import { UserInputModelType } from '../../../users/api/models/input/create-users.input.model';
import bcrypt from 'bcrypt';
import { Users } from '../../../users/domain/users.entity';

export class RegistrationUserCommand {
  constructor(public data: RegistrationUserModelType) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserHandler
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: RegistrationUserCommand) {
    const userId = await this.createUser(command.data);
    const newUser = await this.usersRepository.getUserById(userId);
    await this.emailService.sendUserConfirmationCode(
      command.data.email,
      command.data.login,
      newUser!.emailConfirmation.confirmationCode,
    );
  }

  private async createUser(inputModel: UserInputModelType): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );
    const user = new Users(inputModel, passwordSalt, passwordHash);
    return this.usersRepository.saveUser(user);
  }
  private async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
