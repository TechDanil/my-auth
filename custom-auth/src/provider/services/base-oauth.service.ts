import { BadRequestException, Injectable } from "@nestjs/common";

import type { TypeBaseProviderOptions } from "./types/base-provider.options.types";
import type { TypeUserInfo } from "./types/user-info.type";

@Injectable()
export abstract class BaseOauthService {
  readonly #options: TypeBaseProviderOptions;
  #baseUrl: string;

  constructor(options: TypeBaseProviderOptions) {
    this.#options = options;
  }

  protected extractUserInfo(data: unknown): TypeUserInfo {
    if (!data || typeof data !== "object") {
      throw new BadRequestException("Invalid user profile response.");
    }

    return {
      ...(data as Omit<TypeUserInfo, "provider">),
      provider: this.#options.name,
    };
  }

  public async findUserByCode(code: string): Promise<TypeUserInfo> {
    const clientId = this.#options.clientId;
    const clientSecret = this.#options.clientSecret;

    const tokenQuery = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: this.getRedirectUrl(),
      grant_type: "authorization_code",
    });

    const tokenRequest = await fetch(this.#options.accessUrl, {
      method: "POST",
      body: tokenQuery,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    if (!tokenRequest.ok) {
      throw new BadRequestException(
        `Failed to exchange code for token: ${tokenRequest.statusText}`,
      );
    }

    const tokens = (await tokenRequest.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error?: string;
    };

    if (!tokens.access_token) {
      throw new BadRequestException(
        `Access token missing in response from ${this.#options.accessUrl}.`,
      );
    }

    const userRequest = await fetch(this.#options.profileUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userRequest.ok) {
      throw new BadRequestException(
        `Failed to fetch user profile from ${this.#options.profileUrl}.`,
      );
    }

    const userResponse = (await userRequest.json()) as unknown;

    const user = this.extractUserInfo(userResponse);

    return {
      ...user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_in,
      provider: this.#options.name,
    };
  }

  public getAuthUrl() {
    const query = new URLSearchParams({
      response_type: "code",
      client_id: this.#options.clientId,
      redirect_uri: this.getRedirectUrl(),
      scope: (this.#options.scopes ?? []).join(" "),
      access_type: "offline",
      prompt: "select_account",
    });

    return `${this.#options.authorizeUrl}?${query}`;
  }

  public getRedirectUrl() {
    return `${this.#baseUrl}/auth/oauth/callback/${this.#options.name}`;
  }

  set baseUrl(value: string) {
    this.#baseUrl = value;
  }

  get name() {
    return this.#options.name;
  }

  get accessUrl() {
    return this.#options.accessUrl;
  }

  get profileUrl() {
    return this.#options.profileUrl;
  }

  get scopes() {
    return this.#options.scopes;
  }
}
