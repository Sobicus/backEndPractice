import {
  Body,
  Controller,
  Get,
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
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { JWTService } from 'src/base/application/jwt.service';
import { UserAgent } from '../../../base/decorators/userAgent';
import { CurrentUserId } from 'src/base/decorators/currentUserId';
import { randomUUID } from 'crypto';
import { LoginGuard } from '../../../base/guards/login.guard';
import { JwtAuthGuard } from '../../../base/guards/jwt-refreash.guard';
import { RefreshPayload } from 'src/base/decorators/refreshPayload';
import { JwtAccessAuthGuard } from '../../../base/guards/jwt-access.guard';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationUserCommand } from '../application/command/registrationUser.command';
import { RegistrationConfirmationCommand } from '../application/command/registrationConfirmation.command';
import { RegistrationEmailResendingCommand } from '../application/command/registrationEmailResending.command';
import { PasswordRecoveryCommand } from '../application/command/passwordRecovery.command';
import { NewPasswordCommand } from '../application/command/newPassword.command';
import { CreateDeviceSessionCommand } from '../application/command/createDeviceSession.command';
import { FindSessionByUserIdAndDeviceIdCommand } from '../application/command/findSessionByUserIdAndDeviceId.command';
import { DeleteSessionCommand } from '../application/command/deleteSession.command';
import { UpdateSessionCommand } from '../application/command/updateSession.command';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JWTService,
    private userQueryRepository: UsersQueryRepository,
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

  @UseGuards(JwtAuthGuard)
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
    await this.commandBus.execute(new DeleteSessionCommand(deviceId, userId));
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
    const result = await this.commandBus.execute(
      new UpdateSessionCommand(userId, deviceId, tokensPair.refreshToken),
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

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  async authMe(@TakeUserId() { userId }: { userId: string }) {
    return this.userQueryRepository.getUserByIdForAuthMe(userId);
  }
}
