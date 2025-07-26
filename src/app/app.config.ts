import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import Aura from '@primeuix/themes/aura';
import { urlInterceptor } from './interceptors/baseUrl-interceptor';
import { ToastModule } from 'primeng/toast';
import {  ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
            darkModeSelector: false || 'none'
        }
            }
        }),
    provideHttpClient(),
    provideHttpClient(withInterceptors([urlInterceptor,authInterceptor])),
    importProvidersFrom(ToastModule,ConfirmDialogModule),
    ConfirmationService,
    MessageService
  ],
};
