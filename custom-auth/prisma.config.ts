import 'dotenv/config';
import type { PrismaConfig } from 'prisma';

const postgresUri = (process.env.POSTGRES_URI ?? '').replace(
  /\$\{(\w+)\}/g,
  (_, key: string) => process.env[key],
);

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: './migrations',
    seed: 'tsx ./seed.ts',
  },
  datasource: {
    url: postgresUri,
  },
} satisfies PrismaConfig;
