import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import type { Request } from "express";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "@/user/user.service";
import { AuthMethod, User } from "@prisma/__generated__/client";

@Injectable()
export class AuthService {
  #userService: UserService;

  constructor(userService: UserService) {
    this.#userService = userService;
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

  public async login() { }

  public async logout() { }

  public async refresh() { }

  private async saveSession(request: Request, user: User) {
    return new Promise<User>((resolve, reject) => {
      console.log(request.session);
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
