import { TuiRootModule } from "@taiga-ui/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import type { ApplicationConfig } from "@angular/core";
import { provideZoneChangeDetection, importProvidersFrom } from "@angular/core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(TuiRootModule),
  ],
};
