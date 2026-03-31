import { Reflector } from "@nestjs/core";
import type { Request } from "express";

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Role } from "@prisma/__generated__/client";
import { ROLES_KEY } from "@/auth/decorators/roles.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  #reflector: Reflector;

  constructor(reflector: Reflector) {
    this.#reflector = reflector;
  }

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.#reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: { role: Role } }>();

    if (!roles) return true;

    if (!roles.includes(request.user.role))
      throw new ForbiddenException(
        "You are not authorized to access this resource.",
      );

    return true;
  }
}
