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
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserInputModelType } from './models/input/create-users.input.model';
import {
  PaginationUsersInputModelType,
  usersPagination,
} from '../../../base/pagination-users-helper';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  async getAllUsers(@Query() query: PaginationUsersInputModelType) {
    const pagination = usersPagination(query);
    return this.usersQueryRepository.getAllUsers(pagination);
  }
  @Post()
  async CreateUser(@Body() inputModel: UserInputModelType) {
    const userId = await this.usersService.createUser(inputModel);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (user) return user;
  }
  @Delete(':id')
  @HttpCode(204)
  async DeleteUser(@Param('id') userId: string) {
    const res = await this.usersService.deleteUser(userId);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
}
