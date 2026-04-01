import type { BaseProviderOptions } from "./base-provider.options.types";

export type TypeProviderOptions = Pick<
  BaseProviderOptions,
  "scopes" | "clientId" | "clientSecret"
>;
