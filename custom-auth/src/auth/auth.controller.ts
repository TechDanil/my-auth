import {
  Post,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "@/auth/dto/register.dto";

@Controller("auth")
export class AuthController {
  #authService: AuthService;

  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  public register(@Req() request: Request, @Body() dto: RegisterDto) {
    return this.#authService.register(request, dto);
  }
}
