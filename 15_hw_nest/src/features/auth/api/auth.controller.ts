import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  InputCodeModel,
  InputEmailModel,
  InputNewPasswordModel,
  LoginInputModelType,
  RegistrationUserModelType,
} from './models/input/auth-.input.model';
import { UsersService } from '../../users/application/users.service';
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { JWTService } from 'src/base/application/jwt.service';
import { UserAgent } from '../../../base/decorators/userAgent';
import { CurrentUserId } from 'src/base/decorators/currentUserId';
import { SessionService } from '../../users/infrastructure/sessionsData/session.service';
import { randomUUID } from 'crypto';
import { LoginGuard } from '../../../base/guards/login.guard';
import { JwtAuthGuard } from '../../../base/guards/jwt-refreash.guard';
import { RefreshPayload } from 'src/base/decorators/refreshPayload';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private jwtService: JWTService,
    private sessionService: SessionService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async signIn(
    @Body() loginDTO: LoginInputModelType,
    @UserAgent() deviceName: string,
    @CurrentUserId() userId: string,
    @Ip() ip: string,
    @Res({ passthrough: true })
    res: Response,
  ) {
    // const user = await this.userService.checkCredentials(loginDTO);
    // console.log('userAgent ', userAgent);
    // if (user.status === 'Unauthorized') {
    //   throw new UnauthorizedException();
    // }
    const deviceId = randomUUID();
    const tokensPair = await this.jwtService.createJWT(userId, deviceId);
    await this.sessionService.createDeviceSession(
      tokensPair.refreshToken,
      deviceName,
      ip,
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

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailresending(@Body() email: InputEmailModel) {
    await this.authService.registrationEmailResending(email.email);
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() email: InputEmailModel) {
    await this.authService.passwordRecovery(email.email);
  }

  @HttpCode(204)
  @Post('new-password')
  async newPassword(@Body() newPasswordModel: InputNewPasswordModel) {
    await this.authService.newPassword(newPasswordModel);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(
    @RefreshPayload()
    { userId, deviceId }: { userId: string; deviceId: string },
  ) {
    const session = await this.sessionService.findSessionByUserIdAndDeviceId(
      userId,
      deviceId,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    await this.sessionService.deleteSession(deviceId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshTokens(
    @RefreshPayload()
    { userId, deviceId }: { userId: string; deviceId: string },
    @Res({ passthrough: true })
    res: Response,
  ) {
    const tokensPair = await this.jwtService.createJWT(userId, deviceId);
    const result = await this.sessionService.updateSession(
      userId,
      deviceId,
      tokensPair.refreshToken,
    );
    if (!result) {
      throw new UnauthorizedException();
    }
    res.cookie('refreshToken', tokensPair.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokensPair.accessToken };
  }
}
