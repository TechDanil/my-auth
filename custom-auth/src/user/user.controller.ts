import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { Authorization } from "@/auth/decorators/auth.decorator";
import { Role } from "@prisma/__generated__/enums";

@Controller("user")
export class UserController {
  #userService: UserService;

  constructor(userService: UserService) {
    this.#userService = userService;
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get("profile")
  public async findProfile(@Authorized("id") userId: string) {
    return this.#userService.findById(userId);
  }

  @Authorization(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get("by-id/:id")
  public async findById(@Param("id") userId: string) {
    return this.#userService.findById(userId);
  }
}
