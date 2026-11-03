import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const API_HOST = `${environment.apiUrl}`;
  const cookieService = inject(CookieService);
  if (!request.url.startsWith(API_HOST)) return next(request);

  return next(
    request.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  );
};
