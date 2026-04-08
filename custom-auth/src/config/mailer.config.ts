import { ConfigService } from "@nestjs/config";
import type { MailerOptions } from "@nestjs-modules/mailer";
import { isDev } from "@/libs/utils/is-dev.util";

export const getMailerConfig = (config: ConfigService): MailerOptions => ({
  transport: {
    host: config.getOrThrow<string>("MAIL_HOST"),
    port: config.getOrThrow<number>("MAIL_PORT"),
    secure: !isDev(config),
    auth: {
      user: config.getOrThrow<string>("MAIL_LOGIN"),
      pass: config.getOrThrow<string>("MAIL_PASSWORD"),
    },
  },
  defaults: {
    from: `"Custom Auth" <${config.getOrThrow<string>("MAIL_FROM")}>`,
  },
});
