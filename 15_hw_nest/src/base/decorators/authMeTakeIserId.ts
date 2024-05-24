import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TakeUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request ', request);
    console.log('request user', request.user);
    const userId = request.user?.userId?.toString();
    console.log('TakeUserId', userId);
    if (!userId) {
      return { userId: null };
    }
    return { userId };
  },
);
