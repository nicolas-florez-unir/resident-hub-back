import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserFromRequestInterface } from '../interfaces/user-from-request.interface';

export const UserFromRequest = createParamDecorator<UserFromRequestInterface>(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
