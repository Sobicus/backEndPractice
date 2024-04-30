import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  InputCodeModel,
  InputEmailModel,
  LoginInputModelType,
  RegistrationUserModelType,
} from './models/input/auth-.input.model';
import { UsersService } from '../../users/application/users.service';
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { JWTService } from 'src/base/application/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private jwtService: JWTService,
  ) {}

  @Post('login')
  async signIn(
    @Body() loginDTO: LoginInputModelType,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('loginDTO ', loginDTO);
    const user = await this.userService.checkCredentials(loginDTO);
    console.log('user ', user);
    if (user.status === 'Unauthorized') {
      throw new UnauthorizedException();
    }
    const tokensPair = await this.jwtService.createJWT(
      user.data!._id.toString(),
    );
    res.cookie('refreshToken', tokensPair.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokensPair.accessToken };
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() registrationDTO: RegistrationUserModelType) {
    console.log(registrationDTO);
    await this.authService.registrationUsers(registrationDTO);
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() confirmationCode: InputCodeModel) {
    console.log('confirmationCode ', confirmationCode);
    await this.authService.registrationConfirmation(confirmationCode.code);
  }

  @Post('registration-email-resending')
  async registrationEmailresending(@Body() email: InputEmailModel) {
    await this.authService.registrationEmailResending(email.email);
  }
}
