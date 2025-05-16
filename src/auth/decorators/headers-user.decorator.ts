import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HeadersUserDecorator = createParamDecorator(
  (Headers: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;
  },
);
