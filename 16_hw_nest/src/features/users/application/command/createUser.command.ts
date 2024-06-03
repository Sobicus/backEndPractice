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
    return this.usersService.createUser(command.inputModel);
  }
}
