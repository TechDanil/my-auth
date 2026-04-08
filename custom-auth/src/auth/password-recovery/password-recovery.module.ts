import { Module } from "@nestjs/common";

import { UserService } from "@/user/user.service";
import { MailService } from "@/libs/mail/mail.service";

import { PasswordRecoveryService } from "./password-recovery.service";
import { PasswordRecoveryController } from "./password-recovery.controller";

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, UserService, MailService],
})
export class PasswordRecoveryModule { }
