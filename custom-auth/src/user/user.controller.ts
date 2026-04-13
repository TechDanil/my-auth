import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Body,
} from "@nestjs/common";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { Authorization } from "@/auth/decorators/auth.decorator";
import { Role } from "@prisma/__generated__/enums";

import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

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

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Patch("profile")
  public async updateProfile(
    @Authorized("id") userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.#userService.update(userId, dto);
  }
}
