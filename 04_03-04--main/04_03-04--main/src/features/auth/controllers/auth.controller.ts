import { Body, Controller, Get, HttpCode, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { CookieJwtGuard } from '../../../infrastructure/guards/jwt-cookie.guard';
import { LocalAuthGuard } from '../../../infrastructure/guards/local-auth.guard';
import { SessionRepository } from '../../security/repository/session.repository';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserAgent } from '../decorators/user-agent-from-headers.decorator';
import { CurrentSession } from '../decorators/userId-sessionKey.decorator';
import { ChangeUserConfirmationCommand } from '../service/useCases/change-User-Confirmation.useCase';
import { EmailResendingCommand } from '../service/useCases/email-resending.useCase';
import { RefreshTokenCommand } from '../service/useCases/refresh-token.useCase';
import { UserGetInformationAboutMeCommand } from '../service/useCases/user-get-information-about-me.useCase';
import { UserLoginCommand } from '../service/useCases/user-login.useCase';
import { UserRegistrationCommand } from '../service/useCases/user-registration.UseCase';
import { EmailResendingModel, UserRegistrationModel, ValidationCodeModel } from '../types/input';
import { AboutMeType } from '../types/output';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    //protected authService: AuthService,
    private commandBus: CommandBus,
    private sessionRepository: SessionRepository,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async loginUser(
    //Достаем user agent из headers
    @UserAgent() userAgent: string,
    @Ip() ip: string,
    //Кастомный перехватчик id из request - который мы получаем с помощью гуарда
    @CurrentUser() userId: string,
    // { passthrough: true } для того что бы делать просто return
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const tokenPair = await this.commandBus.execute(new UserLoginCommand(userId, ip, userAgent));
    res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, secure: true });
    return {
      accessToken: tokenPair.token,
    };
  }

  @Post('registration')
  @HttpCode(204)
  async userRegistration(@Body() registrationData: UserRegistrationModel): Promise<void> {
    await this.commandBus.execute(new UserRegistrationCommand(registrationData));
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async userConfirmation(@Body() confirmationCode: ValidationCodeModel): Promise<void> {
    await this.commandBus.execute(new ChangeUserConfirmationCommand(confirmationCode.code, true));
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailConfirmationResending(@Body() body: EmailResendingModel): Promise<void> {
    await this.commandBus.execute(new EmailResendingCommand(body.email));
  }
  @UseGuards(CookieJwtGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async createNewTokensPair(
    @CurrentSession() { userId, tokenKey }: { userId: string; tokenKey: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const tokenPair = await this.commandBus.execute(new RefreshTokenCommand(userId, tokenKey));
    res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, secure: true });
    return {
      accessToken: tokenPair.token,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserInformation(@CurrentUser() userId: string): Promise<AboutMeType> {
    return this.commandBus.execute(new UserGetInformationAboutMeCommand(userId));
  }
  @UseGuards(CookieJwtGuard)
  @Post('logout')
  @HttpCode(204)
  async terminateOtherSession(
    @CurrentSession() { userId, tokenKey }: { userId: string; tokenKey: string },
  ): Promise<void> {
    await this.sessionRepository.terminateSessionWithTokenKey(userId, tokenKey);
  }
}
