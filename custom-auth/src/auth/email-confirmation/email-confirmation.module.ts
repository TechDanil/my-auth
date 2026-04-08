import { forwardRef, Module } from "@nestjs/common";
import { MailModule } from "@/libs/mail/mail.module";
import { AuthModule } from "@/auth/auth.module";

import { EmailConfirmationService } from "./email-confirmation.service";
import { EmailConfirmationController } from "./email-confirmation.controller";

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule { }
