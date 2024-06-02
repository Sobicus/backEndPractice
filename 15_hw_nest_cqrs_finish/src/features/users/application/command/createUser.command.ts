import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputModelType } from '../../api/models/input/create-users.input.model';
import { UsersService } from '../users.service';

export class CreateUserCommand {
  constructor(public readonly inputModel: UserInputModelType) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private usersService: UsersService) {}

  async execute(command: CreateUserCommand) {
    //   const passwordSalt = await bcrypt.genSalt(10);
    //   const passwordHash = await this._generateHash(
    //     command.inputModel.password,
    //     passwordSalt,
    //   );
    //   const user = new Users(command.inputModel, passwordSalt, passwordHash);
    //   return this.usersRepository.saveUser(user);
    // }
    // private async _generateHash(password: string, salt: string) {
    //   return bcrypt.hashSync(password, salt);
    return this.usersService.createUser(command.inputModel);
  }
}
