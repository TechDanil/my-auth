import { BaseOauthService } from "./base-oauth.service";
import type { TypeProviderOptions } from "./types/provider-options.type";

interface GoogleProfile extends Record<string, unknown> {
  aud: string;
  azp: string;
  name: string;
  email: string;
  emailVerified: boolean;
  exp: number;
  givenName: string;
  iat: number;
  iss: string;
  avatar: string;
  sub: string;
  accessToken: string;
  refreshToken?: string;
  familyName?: string;
  locale?: string;
  hd?: string;
  nbf?: number;
  jti?: string;
}

export class GoogleProvider extends BaseOauthService {
  constructor(options: TypeProviderOptions) {
    super({
      name: "google",
      authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      accessUrl: "https://oauth2.googleapis.com/token",
      profileUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
      scopes: options.scopes,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
    });
  }

  protected extractUserInfo(data: GoogleProfile): TypeUserInfo {
    return super.extractUserInfo({
      email: data.email,
      name: data.name,
      avatar: data.avatar,
    });
  }
}
