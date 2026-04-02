import { TypeProvideOptions } from "@/provider/provider.constants";
import { GoogleProvider } from "@/provider/services/google.provider";
import { YandexProvider } from "@/provider/services/yandex.provider";
import { ConfigService } from "@nestjs/config";

export const getProvidersConfig = async (
  config: ConfigService,
): Promise<TypeProvideOptions> => ({
  baseUrl: config.getOrThrow<string>("APPLICATION_URL"),
  services: [
    new GoogleProvider({
      clientId: config.getOrThrow<string>("GOOGLE_CLIENT_ID"),
      clientSecret: config.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
      scopes: ["profile", "email"],
    }),
    new YandexProvider({
      clientId: config.getOrThrow<string>("YANDEX_CLIENT_ID"),
      clientSecret: config.getOrThrow<string>("YANDEX_CLIENT_SECRET"),
      scopes: ["login:email", "login:avatar", "login:info"],
    }),
  ],
});
