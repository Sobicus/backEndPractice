import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInputModelType } from './models/input/create-users.input.model';
import {
  PaginationUsersInputModelType,
  usersPagination,
} from '../../../base/helpers/pagination-users-helper';
import { UserAuthGuard } from '../../../base/guards/basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/command/createUser.command';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { DeleteUserCommand } from '../application/command/deleteUser.command';

@Controller('sa/users')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(UserAuthGuard)
  @Get()
  async getAllUsers(@Query() query: PaginationUsersInputModelType) {
    const pagination = usersPagination(query);
    return this.usersQueryRepository.getAllUsers(pagination);
  }

  @UseGuards(UserAuthGuard)
  @Post()
  async CreateUser(@Body() inputModel: UserInputModelType) {
    const userId = await this.commandBus.execute(
      new CreateUserCommand(inputModel),
    );
    const user = await this.usersQueryRepository.getUserById(userId);
    if (user) return user;
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async DeleteUser(@Param('id') userId: string) {
    const res = await this.commandBus.execute(new DeleteUserCommand(userId));
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
}
