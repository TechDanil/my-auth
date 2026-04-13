import { PrismaService } from "@/prisma/prisma.service";
import { MailService } from "@/libs/mail/mail.service";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TokenType } from "@prisma/__generated__/enums";

const TWO_FACTOR_TOKEN_MIN = 100_000;
const TWO_FACTOR_TOKEN_MAX = 1000_000;

const TWO_FACTOR_TOKEN_EXPIRATION_TIME = 5 * 60 * 1000;

@Injectable()
export class TwoFactorAuthService {
  readonly #prismaService: PrismaService;
  readonly #mailService: MailService;

  constructor(prismaService: PrismaService, mailService: MailService) {
    this.#prismaService = prismaService;
    this.#mailService = mailService;
  }

  public async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.#generateTwoFactorToken(email);

    await this.#mailService.sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token,
    );

    return true;
  }

  public async validateTwoFactorToken(email: string, code: string) {
    const existingToken = await this.#prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        "Token not found. Please, request a new two factor token.",
      );
    }

    if (existingToken.token !== code) {
      throw new BadRequestException("Invalid code. Please, try again.");
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        "Token has expired. Please, request a new two factor token.",
      );
    }

    await this.#prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR,
      },
    });

    return true;
  }

  async #generateTwoFactorToken(email: string) {
    const token = Math.floor(
      Math.random() * (TWO_FACTOR_TOKEN_MAX - TWO_FACTOR_TOKEN_MIN) +
      TWO_FACTOR_TOKEN_MIN,
    ).toString();

    const expiresIn = new Date(
      new Date().getTime() + TWO_FACTOR_TOKEN_EXPIRATION_TIME,
    );

    const isExistingToken = await this.#prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (isExistingToken) {
      await this.#prismaService.token.delete({
        where: {
          id: isExistingToken.id,
          type: TokenType.TWO_FACTOR,
        },
      });
    }

    const verificationToken = await this.#prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.TWO_FACTOR,
      },
    });

    return verificationToken;
  }
}
