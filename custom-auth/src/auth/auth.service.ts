import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { UserService } from "@/user/user.service";
import { AuthMethod, User } from "@prisma/__generated__/client";
import { verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { ProviderService } from "@/provider/provider.service";
import { PrismaService } from "@/prisma/prisma.service";

import { LoginDto, RegisterDto } from "./dto";
import { EmailConfirmationService } from "./email-confirmation/email-confirmation.service";

@Injectable()
export class AuthService {
  readonly #userService: UserService;
  readonly #config: ConfigService;
  readonly #providerService: ProviderService;
  readonly #prismaService: PrismaService;
  readonly #emailConfirmationService: EmailConfirmationService;

  constructor(
    userService: UserService,
    config: ConfigService,
    providerService: ProviderService,
    prismaService: PrismaService,
    emailConfirmationService: EmailConfirmationService,
  ) {
    this.#userService = userService;
    this.#config = config;
    this.#providerService = providerService;
    this.#prismaService = prismaService;
    this.#emailConfirmationService = emailConfirmationService;
  }

  public async register(request: Request, dto: RegisterDto) {
    const hasUser = await this.#userService.findByEmail(dto.email);

    if (hasUser) {
      throw new ConflictException("User already exists");
    }

    const newUser = await this.#userService.create(
      dto.email,
      dto.password,
      dto.name,
      "",
      AuthMethod.CREDENTIALS,
      false,
    );

    await this.#emailConfirmationService.sendVerificationToken(newUser);

    return {
      message:
        "You have been registered successfully. Please, check your email to verify your account.",
    };
  }

  public async login(request: Request, dto: LoginDto) {
    const user = await this.#userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Invalid password. Please, try again or reset the password if you forgot it.",
      );
    }

    if (!user.isEmailVerified) {
      await this.#emailConfirmationService.sendVerificationToken(user);
      throw new UnauthorizedException(
        "Please, verify your email to login. If you did not receive the verification email, please request a new one.",
      );
    }

    return this.saveSession(request, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.#providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);

    const account = await this.#prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await this.#userService.findById(account.userId)
      : null;

    if (user) {
      return this.saveSession(req, user);
    }

    user = await this.#userService.create(
      profile.email,
      "",
      profile.name ?? profile.email,
      profile.avatar,
      AuthMethod[profile.provider.toUpperCase()],
      true,
    );

    if (!account) {
      await this.#prismaService.account.create({
        data: {
          userId: profile.id,
          type: "oauth",
          provider: profile.provider,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          expiresAt: profile.expiresAt,
        },
      });
    }

    return this.saveSession(req, user);
  }

  public async logout(request: Request, response: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      request.session.destroy((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              "Failed to delete session. Maybe occurred a problem with the server or the session has already been deleted.",
            ),
          );
        }

        response.clearCookie(this.#config.getOrThrow("SESSION_NAME"));
        resolve();
      });
    });
  }

  public async refresh() { }

  public async saveSession(request: Request, user: User) {
    return new Promise<User>((resolve, reject) => {
      request.session.userId = user.id;

      request.session.save((error) => {
        if (error) {
          const sessionError = new InternalServerErrorException(
            "Failed to save session, check if parameters are correct.",
          );

          return reject(sessionError);
        }

        return resolve(user);
      });
    });
  }
}
