import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../base/guards/jwt-refreash.guard';
import { RefreshPayload } from '../../../base/decorators/refreshPayload';
import { FindActiveSessionCommand } from '../application/command/getAllActiveSessions.command';
import { DeleteSessionExceptThisCommand } from '../application/command/deleteSessionsDevicesExceptThis.command';
import { DeleteDeviceSessionCommand } from '../application/command/deleteSessionDevice.command';

@Controller('security')
export class SecurityDevicesController {
  constructor(private commandBud: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllDevices(
    @RefreshPayload()
    { userId }: { userId: string },
  ) {
    return await this.commandBud.execute(new FindActiveSessionCommand(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('devices')
  async deleteDevicesExceptThis(
    @RefreshPayload()
    { userId, deviceId }: { userId: string; deviceId: string },
  ) {
    await this.commandBud.execute(
      new DeleteSessionExceptThisCommand(userId, deviceId),
    );
  }

  @UseGuards(JwtAuthGuard)
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
