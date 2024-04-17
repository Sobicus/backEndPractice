import { Body, Controller, Post } from '@nestjs/common';
import { LoginInputModelType } from './models/input/auth-.input.model';
import { UsersService } from '../../users/application/users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}
  @Post('login')
  async signIn(@Body() loginInputModel: LoginInputModelType) {}
}
