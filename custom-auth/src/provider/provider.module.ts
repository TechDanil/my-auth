import { DynamicModule, Module } from "@nestjs/common";
import {
  ProvideOptionsSymbol,
  TypeAsyncOptions,
  TypeProvideOptions,
} from "./provider.constants";
import { ProviderService } from "./provider.service";

@Module({})
export class ProviderModule {
  public static register(options: TypeProvideOptions): DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        {
          provide: ProvideOptionsSymbol,
          useValue: options.services,
        },
        ProviderService,
      ],
      exports: [ProviderService],
    };
  }

  public static registerAsync(options: TypeAsyncOptions): DynamicModule {
    return {
      module: ProviderModule,
      imports: options.imports,
      providers: [
        {
          provide: ProvideOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [ProviderService],
    };
  }
}
