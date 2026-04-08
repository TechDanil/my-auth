import { render } from "@react-email/components";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ConfirmationTemplate } from "./templates/confirmation.template";

@Injectable()
export class MailService {
  readonly #mailerService: MailerService;
  readonly #configService: ConfigService;

  constructor(mailerService: MailerService, configService: ConfigService) {
    this.#mailerService = mailerService;
    this.#configService = configService;
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.#configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(ConfirmationTemplate({ domain, token }));

    return this.#sendMail(email, "Email Confirmation", html);
  }

  #sendMail(email: string, subject: string, html: string) {
    return this.#mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
