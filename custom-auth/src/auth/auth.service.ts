import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { LoginDto, RegisterDto } from "./dto";
import { UserService } from "@/user/user.service";
import { AuthMethod, User } from "@prisma/__generated__/client";
import { verify } from "argon2";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  #userService: UserService;
  #config: ConfigService;

  constructor(userService: UserService, config: ConfigService) {
    this.#userService = userService;
    this.#config = config;
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

    return this.saveSession(request, newUser);
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

    return this.saveSession(request, user);
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

  private async saveSession(request: Request, user: User) {
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
