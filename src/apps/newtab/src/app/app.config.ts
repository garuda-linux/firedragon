import { provideHttpClient, withFetch } from "@angular/common/http";
import {
  type ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideGarudaNG } from "@garudalinux/core";
import { APP_CONFIG } from "../environments/app-config.token";
import { environment } from "../environments/environment.dev";
import { routes } from "./app.routes";
import { TranslocoHttpLoader } from "./transloco-loader";
import { provideTransloco, provideTranslocoLoader } from "@jsverse/transloco";
import { ConfigService } from "../config/config.service";
import { provideHashLocationStrategy } from "./hash_location_strategy";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideGarudaNG(
      { font: "InterVariable" },
      {
        theme: {
          options: {
            darkModeSelector: ".p-dark",
          },
        },
        ripple: true,
        inputStyle: "outlined",
      },
    ),
    provideRouter(routes, withHashLocation()),
    provideHashLocationStrategy(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideAppInitializer(async () => {
      const configService = inject(ConfigService);
      while (!configService.initialized()) {
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 0);
        });
      }
    }),
    provideTransloco({
      config: {
        availableLangs: environment.availableLanguages,
        defaultLang: environment.defaultLanguage,
        fallbackLang: environment.defaultLanguage,
        missingHandler: {
          useFallbackTranslation: true,
        },
        prodMode: !isDevMode(),
        reRenderOnLangChange: true,
      },
    }),
    provideTranslocoLoader(TranslocoHttpLoader),
    { provide: APP_CONFIG, useValue: environment },
  ],
};
