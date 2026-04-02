import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ProvideOptionsSymbol, TypeProvideOptions } from "./provider.constants";
import { BaseOauthService } from "./services/base-oauth.service";

@Injectable()
export class ProviderService implements OnModuleInit {
  #options: TypeProvideOptions;

  constructor(@Inject(ProvideOptionsSymbol) options: TypeProvideOptions) {
    this.#options = options;
  }

  public onModuleInit() {
    for (const service of this.#options.services) {
      service.baseUrl = this.#options.baseUrl;
    }
  }

  public findByService(service: string): BaseOauthService | null {
    return (
      this.#options.services.find(
        (currentService) => currentService.name === service,
      ) ?? null
    );
  }
}
