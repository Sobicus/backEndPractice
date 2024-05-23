import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { QueryPaginationPipe } from '../../../infrastructure/decorators/transform/query-pagination.pipe';
import { AuthGuard } from '../../../infrastructure/guards/auth-basic.guard';
import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { PaginationWithItems } from '../../common/types/output';
import { UserQueryRepository } from '../repositories/user.query.repository';
import { UserService } from '../services/user.service';
import { UserCreateModel } from '../types/input';
import { UserOutputType } from '../types/output';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    protected readonly userService: UserService,
    protected readonly userQueryRepository: UserQueryRepository,
  ) {}
  @Post('')
  @HttpCode(201)
  async createUser(@Body() userCreateData: UserCreateModel): Promise<UserOutputType> {
    return this.userService.createUserToDto(userCreateData);
  }
  @Get('')
  async getAllUsers(
    @Query(QueryPaginationPipe) queryData: QueryPaginationResult,
  ): Promise<PaginationWithItems<UserOutputType>> {
    return this.userQueryRepository.findAll(queryData);
  }
  @Delete(':userId')
  @HttpCode(204)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    const deleteResult = await this.userService.deleteUser(userId);
    if (!deleteResult) throw new HttpException(`user do not exist`, HttpStatus.NOT_FOUND);
    return;
  }
}
