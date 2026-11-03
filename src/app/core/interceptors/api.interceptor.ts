import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { AuthStorageService } from '../services/auth-storage';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const API_HOST = `${environment.apiUrl}`;
  const authStorage = inject(AuthStorageService);
  if (!request.url.startsWith(API_HOST)) return next(request);

  return next(
    request.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authStorage.accessToken ?? '',
        ...(authStorage.sessionUid ? { 'x-user-id': authStorage.sessionUid } : {}),
      },
    }),
  );
};
