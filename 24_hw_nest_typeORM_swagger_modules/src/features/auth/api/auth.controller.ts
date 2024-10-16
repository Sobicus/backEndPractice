import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { randomUUID } from 'crypto';
import { Response } from 'express';

import { JwtAccessAuthGuard } from '../../../base/guards/jwt-access.guard';
import { JwtRefreshAuthGuard } from '../../../base/guards/jwt-refreash.guard';
import { LoginGuard } from '../../../base/guards/login.guard';
import { CreateDeviceSessionCommand } from '../../SecurityDevices/application/command/createDeviceSession.command';
import { DeleteSessionCommand } from '../../SecurityDevices/application/command/deleteSession.command';
import { FindSessionByUserIdAndDeviceIdCommand } from '../../SecurityDevices/application/command/findSessionByUserIdAndDeviceId.command';
import { UpdateSessionCommand } from '../../SecurityDevices/application/command/updateSession.command';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { NewPasswordCommand } from '../application/command/newPassword.command';
import { PasswordRecoveryCommand } from '../application/command/passwordRecovery.command';
import { RegistrationConfirmationCommand } from '../application/command/registrationConfirmation.command';
import { RegistrationEmailResendingCommand } from '../application/command/registrationEmailResending.command';
import { RegistrationUserCommand } from '../application/command/registrationUser.command';
import {
  InputCodeModel,
  InputEmailModel,
  InputNewPasswordModel,
  LoginInputModelType,
  RegistrationUserModelType,
} from './models/input/auth-.input.model';
import { JWTService } from '../../../base/application/jwt.service';
import { UserAgent } from '../../../base/decorators/userAgent';
import { CurrentUserId } from '../../../base/decorators/currentUserId';
import { RefreshPayload } from '../../../base/decorators/accessPayload';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JWTService,
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @HttpCode(200)
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
    const deviceId = randomUUID();
    const tokensPair = await this.jwtService.createJWT(userId, deviceId);
    await this.commandBus.execute(
      new CreateDeviceSessionCommand(tokensPair.refreshToken, deviceName, ip),
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
    await this.commandBus.execute(new RegistrationUserCommand(registrationDTO));
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() confirmationCode: InputCodeModel) {
    await this.commandBus.execute(
      new RegistrationConfirmationCommand(confirmationCode.code),
    );
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailresending(@Body() email: InputEmailModel) {
    await this.commandBus.execute(
      new RegistrationEmailResendingCommand(email.email),
    );
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() email: InputEmailModel) {
    await this.commandBus.execute(new PasswordRecoveryCommand(email.email));
  }

  @HttpCode(204)
  @Post('new-password')
  async newPassword(@Body() newPasswordModel: InputNewPasswordModel) {
    await this.commandBus.execute(new NewPasswordCommand(newPasswordModel));
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(
    @RefreshPayload()
    { userId, deviceId }: { userId: string; deviceId: string },
  ) {
    const session = await this.commandBus.execute(
      new FindSessionByUserIdAndDeviceIdCommand(userId, deviceId),
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    await this.commandBus.execute(new DeleteSessionCommand(userId, deviceId));
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshTokens(
    @RefreshPayload()
    { userId, deviceId }: { userId: string; deviceId: string },
    @Res({ passthrough: true })
    res: Response,
  ) {
    const tokensPair = await this.jwtService.createJWT(userId, deviceId);
    await this.commandBus.execute(
      new UpdateSessionCommand(userId, deviceId, tokensPair.refreshToken),
    );
    res.cookie('refreshToken', tokensPair.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokensPair.accessToken };
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  async authMe(@TakeUserId() { userId }: { userId: number }) {
    const authMe = await this.usersQueryRepository.getUserByIdForAuthMe(userId);
    if (!authMe) {
      throw new NotFoundException();
    }
    return authMe;
  }
}
