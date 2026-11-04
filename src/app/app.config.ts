import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  GoogleOutline,
  MailOutline,
  PhoneOutline,
  SafetyOutline,
} from '@ant-design/icons-angular/icons';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor, refreshTokenInterceptor } from './core/interceptors/api.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideNzI18n(en_US),
    provideNzIcons([GoogleOutline, MailOutline, PhoneOutline, SafetyOutline]),
    provideHttpClient(withInterceptors([apiInterceptor, refreshTokenInterceptor])),
  ],
};
