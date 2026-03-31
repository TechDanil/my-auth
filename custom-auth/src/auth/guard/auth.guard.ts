import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "@/user/user.service";
import type { Request } from "express";
import { User } from "@prisma/__generated__/client";

@Injectable()
export class AuthGuard implements CanActivate {
  #userService: UserService;

  constructor(userService: UserService) {
    this.#userService = userService;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();

    if (typeof request.session.userId === "undefined")
      throw new UnauthorizedException(
        "Unauthorized. Please, login to access this resource.",
      );

    const user = await this.#userService.findById(request.session.userId);

    request.user = user;

    return true;
  }
}
