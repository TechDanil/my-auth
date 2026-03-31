import {
  Post,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";

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

  @Post("login")
  @HttpCode(HttpStatus.OK)
  public login(@Req() request: Request, @Body() dto: LoginDto) {
    return this.#authService.login(request, dto);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  public logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.#authService.logout(request, response);
  }
}
