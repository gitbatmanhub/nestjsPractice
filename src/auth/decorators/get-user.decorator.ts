import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUserREST = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }
    return !data ? user : user[data];
  },
);

export const GetUserGraphQL = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const req = context.getContext().req;

    const user = req.user;
    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return !data ? user : user[data];
  },
);
