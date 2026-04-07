import {
  Post,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Get,
  UseGuards,
  Param,
  Query,
  BadRequestException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
import { AuthProviderGuard } from "./guards/provider.guard";
import { ProviderService } from "@/provider/provider.service";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  readonly #authService: AuthService;
  readonly #providerService: ProviderService;
  readonly #config: ConfigService;

  constructor(
    authService: AuthService,
    providerService: ProviderService,
    config: ConfigService,
  ) {
    this.#authService = authService;
    this.#providerService = providerService;
    this.#config = config;
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  public register(@Req() request: Request, @Body() dto: RegisterDto) {
    return this.#authService.register(request, dto);
  }

  @Get("/oauth/callback/:provider")
  @UseGuards(AuthProviderGuard)
  public async callback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query("code") code: string,
    @Param("provider") provider: string,
  ) {
    if (!code) {
      throw new BadRequestException("Code is required");
    }

    await this.#authService.extractProfileFromCode(request, provider, code);

    return response.redirect(
      `${this.#config.getOrThrow<string>("ALLOWED_ORIGIN")}/dashboard/settings`,
    );
  }

  @Get("oauth/connect/:provider")
  @UseGuards(AuthProviderGuard)
  @HttpCode(HttpStatus.OK)
  public connect(@Param("provider") provider: string) {
    const providerInstance = this.#providerService.findByService(provider);

    return {
      url: providerInstance.getAuthUrl(),
    };
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
