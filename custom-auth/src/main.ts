import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { resolveEnvTemplate } from "@/libs/utils/resolve-env-template.util";
import { ms, StringValue } from "@/libs/utils/ms.util";
import { parseBoolean } from "@/libs/utils/parse-boolean.util";

import { RedisStore } from "connect-redis";
import { createClient } from "redis";

import cookieParser from "cookie-parser";
import session from "express-session";

import { AppModule } from "./app.module";

const redisUri = resolveEnvTemplate(process.env.REDIS_URI);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = createClient({
    url: redisUri,
  });

  await redis.connect();

  app.use(cookieParser(config.getOrThrow<string>("COOKIE_SECRET")));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<string>("SESSION_SECRET"),
      name: config.getOrThrow<string>("SESSION_NAME"),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>("SESSION_DOMAIN"),
        maxAge: ms(config.getOrThrow<StringValue>("SESSION_MAX_AGE")),
        httpOnly: parseBoolean(config.getOrThrow<string>("SESSION_HTTP_ONLY")),
        secure: parseBoolean(config.getOrThrow<string>("SESSION_SECURE")),
        sameSite: "lax",
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>("SESSION_PREFIX"),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
    credentials: true,
    exposedHeaders: ["set-cookie"],
  });

  await app.listen(config.getOrThrow<number>("APPLICATION_PORT"));
}

bootstrap();
