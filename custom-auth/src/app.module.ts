import { IS_DEV_ENV } from "@/libs/utils/is-dev.util";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MailModule } from "./libs/mail/mail.module";
import { EmailConfirmationModule } from "./auth/email-confirmation/email-confirmation.module";
import { PasswordRecoveryModule } from "./auth/password-recovery/password-recovery.module";
import { TwoFactorAuthModule } from "./auth/two-factor-auth/two-factor-auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule,
  ],
})
export class AppModule { }
