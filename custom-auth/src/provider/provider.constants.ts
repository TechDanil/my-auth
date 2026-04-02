import { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import { BaseOauthService } from "./services/base-oauth.service";

export const ProvideOptionsSymbol = Symbol();

export type TypeProvideOptions = {
  baseUrl: string;
  services: BaseOauthService[];
};

export type TypeAsyncOptions = Pick<ModuleMetadata, "imports"> &
  Pick<FactoryProvider<TypeProvideOptions>, "useFactory" | "inject">;
