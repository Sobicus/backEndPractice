import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RefreshPayload } from '../../../base/decorators/refreshPayload';
import { JwtRefreshAuthGuard } from '../../../base/guards/jwt-refreash.guard';
import { DeleteDeviceSessionCommand } from '../application/command/deleteSessionDevice.command';
import { DeleteSessionExceptThisCommand } from '../application/command/deleteSessionsDevicesExceptThis.command';
import { FindActiveSessionCommand } from '../application/command/getAllActiveSessions.command';

@Controller('security')
export class SecurityDevicesController {
  constructor(private commandBud: CommandBus) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('devices')
  async getAllDevices(
    @RefreshPayload()
    { userId }: { userId: string },
  ) {
    return await this.commandBud.execute(new FindActiveSessionCommand(userId));
  }

  @HttpCode(204)
  @UseGuards(JwtRefreshAuthGuard)
  @Delete('devices')
  async deleteDevicesExceptThis(
    @RefreshPayload()
    { userId, deviceId }: { userId: string; deviceId: string },
  ) {
    await this.commandBud.execute(
      new DeleteSessionExceptThisCommand(userId, deviceId),
    );
  }

  @HttpCode(204)
  @UseGuards(JwtRefreshAuthGuard)
  @Delete('devices/:deviceId')
  async deleteSessionDevice(
    @Param('deviceId') deviceId: string,
    @RefreshPayload()
    { userId }: { userId: string },
  ) {
    const result = await this.commandBud.execute(
      new DeleteDeviceSessionCommand(userId, deviceId),
    );
    if (result.status === 'NotFound') {
      throw new NotFoundException();
    }
    if (result.status === 'Forbidden') {
      throw new ForbiddenException();
    }
  }
}
