import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from '../service/auth.service';
import { EmailResendingModel, UserLoginModel, UserRegistrationModel, ValidationCodeModel } from '../types/input';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}
  @Post('login')
  //используем @res для работы с респонсом
  async loginUser(
    @Body() loginData: UserLoginModel,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const tokenPair = await this.authService.userLogin(loginData);
    //Создаем куки
    res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, secure: true });

    return {
      accessToken: tokenPair.token,
    };
  }

  @Post('registration')
  @HttpCode(204)
  async userRegistration(@Body() registrationData: UserRegistrationModel): Promise<void> {
    await this.authService.userRegistration(registrationData);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async userConfirmation(@Body() confirmationCode: ValidationCodeModel): Promise<void> {
    await this.authService.userConfirmation(confirmationCode.code, true);
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailConfirmationResending(@Body() body: EmailResendingModel): Promise<void> {
    await this.authService.emailResending(body.email);
  }
}
