import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/__generated__/client";
import { PrismaPg } from "@prisma/adapter-pg";

const postgresUri = (process.env.POSTGRES_URI ?? "").replace(
  /\$\{(\w+)\}/g,
  (_, key: string) => process.env[key],
);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: postgresUri,
      }),
    });
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
