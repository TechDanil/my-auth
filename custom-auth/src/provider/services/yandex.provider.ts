import { BaseOauthService } from "./base-oauth.service";
import type { TypeProviderOptions } from "./types/provider-options.type";
import type { TypeUserInfo } from "./types/user-info.type";

interface YandexProfile {
  id: string;
  login: string;
  clientId: string;
  psuid: string;
  accessToken: string;
  emails?: string[];
  defaultEmail?: string;
  isAvatarEmpty?: string;
  defaultAvatarId?: string;
  birthday?: string | null;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  realName?: string;
  sex?: "male" | "female" | null;
  defaultPhone?: { id: number; number: string };
  refreshToken?: string;
}

export class YandexProvider extends BaseOauthService {
  constructor(options: TypeProviderOptions) {
    super({
      name: "yandex",
      authorizeUrl: "https://oauth.yandex.ru/authorize",
      accessUrl: "https://oauth.yandex.ru/token",
      profileUrl: "https://login.yandex.ru/info?format=json",
      scopes: options.scopes,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
    });
  }

  protected extractUserInfo(data: YandexProfile): TypeUserInfo {
    return super.extractUserInfo({
      email: data.defaultEmail ?? data.emails?.[0],
      name: data.displayName ?? data.realName ?? data.login,
      avatar: data.defaultAvatarId
        ? `https://avatars.yandex.net/get-yapic/${data.defaultAvatarId}/islands-200`
        : undefined,
    });
  }
}
