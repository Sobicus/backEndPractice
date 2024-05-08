import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const test = request.user;
    console.log('sadfoiu;hadsvobuij;ndvwsabijldsvaBIJLDswfbijlu', test);
    return request.headers['user-agent'] ?? 'unknown';
  },
);
