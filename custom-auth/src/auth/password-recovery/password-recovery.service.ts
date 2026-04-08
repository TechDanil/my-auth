import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";

import { TokenType } from "@prisma/__generated__/enums";

import { MailService } from "@/libs/mail/mail.service";
import { PrismaService } from "@/prisma/prisma.service";
import { UserService } from "@/user/user.service";

import { ResetPasswordDto, NewPasswordDto } from "./dto";
import { hash } from "argon2";

@Injectable()
export class PasswordRecoveryService {
  readonly #prismaService: PrismaService;
  readonly #userService: UserService;
  readonly #mailService: MailService;

  constructor(
    prismaService: PrismaService,
    userService: UserService,
    mailService: MailService,
  ) {
    this.#prismaService = prismaService;
    this.#userService = userService;
    this.#mailService = mailService;
  }

  public async resetPassword(dto: ResetPasswordDto) {
    const existingUser = await this.#userService.findByEmail(dto.email);

    if (!existingUser) {
      throw new NotFoundException(
        "User not found with this email. Please, make sure you are using the correct email address.",
      );
    }

    const passwordResetToken = await this.#generatePasswordResetToken(
      existingUser.email,
    );

    await this.#mailService.sendResetPasswordEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.#prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        "Token not found. Please, make sure you used a correct token or  request a new password reset token.",
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        "Token has expired. Please, request a new password reset token.",
      );
    }

    const existingUser = await this.#userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        "User not found with this email. Please, make sure you are using the correct email address.",
      );
    }

    await this.#prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(dto.password),
      },
    });

    await this.#prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }

  async #generatePasswordResetToken(email: string) {
    const token = randomUUID();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const isExistingToken = await this.#prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (isExistingToken) {
      await this.#prismaService.token.delete({
        where: {
          id: isExistingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      });
    }

    const passwordResetToken = await this.#prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return passwordResetToken;
  }
}
