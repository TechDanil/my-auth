import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { Recaptcha } from "@nestlab/google-recaptcha";

import { PasswordRecoveryService } from "./password-recovery.service";
import { NewPasswordDto, ResetPasswordDto } from "./dto";

@Controller("auth/password-recovery")
export class PasswordRecoveryController {
  readonly #passwordRecoveryService: PasswordRecoveryService;

  constructor(passwordRecoveryService: PasswordRecoveryService) {
    this.#passwordRecoveryService = passwordRecoveryService;
  }

  @Recaptcha()
  @Post("reset")
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.#passwordRecoveryService.resetPassword(dto);
  }

  @Recaptcha()
  @Post("new/:token")
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param("token") token: string,
  ) {
    return this.#passwordRecoveryService.newPassword(dto, token);
  }
}
