import { ProviderService } from "@/provider/provider.service";
import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from "@nestjs/common";
import type { Request } from "express";

export class AuthProviderGuard implements CanActivate {
  readonly #providerService: ProviderService;

  public canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { params: { provider: string } }>();

    const provider = request.params.provider;

    const providerInstance = this.#providerService.findByService(provider);

    if (!providerInstance) {
      throw new NotFoundException(
        `Provider not found. Please, check if the provider is valid.`,
      );
    }

    return true;
  }
}
