import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/__generated__/client";

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    return data ? request.user[data] : request.user;
  },
);
