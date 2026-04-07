import { ProviderService } from "@/provider/provider.service";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class AuthProviderGuard implements CanActivate {
  readonly #providerService: ProviderService;

  constructor(providerService: ProviderService) {
    this.#providerService = providerService;
  }

  public canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { params: { provider: string | string[] } }>();

    const providerParam = request.params.provider;
    const provider = Array.isArray(providerParam)
      ? providerParam[0]
      : providerParam;

    if (!provider) {
      throw new NotFoundException(
        `Provider not found. Please, check if the provider is valid.`,
      );
    }

    const providerInstance = this.#providerService.findByService(provider);

    if (!providerInstance) {
      throw new NotFoundException(
        `Provider not found. Please, check if the provider is valid.`,
      );
    }

    return true;
  }
}
