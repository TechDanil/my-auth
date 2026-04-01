import type { TypeBaseProviderOptions } from "./base-provider.options.types";

export type TypeProviderOptions = Pick<
  TypeBaseProviderOptions,
  "scopes" | "clientId" | "clientSecret"
>;
