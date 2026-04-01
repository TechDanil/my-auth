import { isDev } from "@/libs/utils/is-dev.util";
import { ConfigService } from "@nestjs/config";
import { GoogleRecaptchaModuleOptions } from "@nestlab/google-recaptcha";
import type { Request } from "express";

export const getRecaptchaConfig = (
  config: ConfigService,
): GoogleRecaptchaModuleOptions => ({
  secretKey: config.getOrThrow("GOOGLE_RECAPTCHA_SECRET_KEY"),
  response: (req: Request) => {
    const recaptchaHeader = req.headers.recaptcha;

    if (Array.isArray(recaptchaHeader)) {
      return recaptchaHeader[0];
    }

    return recaptchaHeader;
  }, 
  skipIf: isDev(config),
});
