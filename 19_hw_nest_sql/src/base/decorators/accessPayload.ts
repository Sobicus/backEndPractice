import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const deviceId = request.user.deviceId.toString();
    const userId = request.user.userId.toString();
    return { userId, deviceId };
  },
);
