import { IS_DEV_ENV } from "@/libs/common/utils/is-dev.util";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
  ],
})
export class AppModule {}
