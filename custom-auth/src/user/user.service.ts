import { AuthMethod } from "./../../prisma/__generated__/enums";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";

import { hash } from "argon2";

@Injectable()
export class UserService {
  #prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#prisma = prisma;
  }

  public async findById(id: string) {
    const user = await this.#prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.#prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    avatar: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    const user = await this.#prisma.user.create({
      data: {
        email,
        password: password ? await hash(password) : "",
        displayName,
        avatar,
        method,
        isEmailVerified: isVerified,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }
}
