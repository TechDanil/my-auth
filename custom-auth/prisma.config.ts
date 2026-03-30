import "dotenv/config";
import type { PrismaConfig } from "prisma";
import { resolveEnvTemplate } from "./src/libs/utils/resolve-env-template.util";

const postgresUri = resolveEnvTemplate(process.env.POSTGRES_URI);

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "./migrations",
    seed: "tsx ./seed.ts",
  },
  datasource: {
    url: postgresUri,
  },
} satisfies PrismaConfig;
