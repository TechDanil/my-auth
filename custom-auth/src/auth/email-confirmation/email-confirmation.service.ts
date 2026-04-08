import { PrismaService } from "@/prisma/prisma.service";
import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { randomUUID } from "crypto";

import type { Request } from "express";

import { TokenType } from "@prisma/__generated__/enums";
import { MailService } from "@/libs/mail/mail.service";
import { UserService } from "@/user/user.service";
import { AuthService } from "@/auth/auth.service";

import { ConfirmationDto } from "./dto/confirmation.dto";
import { User } from "@prisma/__generated__/client";

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async sendVerificationToken(user: User) {
    const verificationToken = await this.#generateVerificationToken(user.email);

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return true;
  }

  public async newVerification(request: Request, dto: ConfirmationDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        "Token not found. Please, request a new verification token.",
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        "Token has expired. Please, request a new verification token.",
      );
    }

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        "User not found with this email. Please, make sure you are using the correct email address.",
      );
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isEmailVerified: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    });

    return this.authService.saveSession(request, existingUser);
  }

  async #generateVerificationToken(email: string) {
    const token = randomUUID();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const isExistingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
      },
    });

    if (isExistingToken) {
      await this.prismaService.token.delete({
        where: {
          id: isExistingToken.id,
          type: TokenType.VERIFICATION,
        },
      });
    }

    const verificationToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION,
      },
    });

    return verificationToken;
  }
}
