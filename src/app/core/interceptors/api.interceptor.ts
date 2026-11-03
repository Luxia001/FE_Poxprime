import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStorageService } from '../services/auth-storage';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { RefreshTokenService } from '../services/refresh-token';

// endpoint ที่ไม่ต้องใช้ token
const PUBLIC_PATHS = [
  '/v1/auth/login',
  '/v1/member/register',
  '/v1/auth/refresh',
];

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const apiHost = environment.apiUrl;

  if (!request.url.startsWith(`${apiHost}/`)) return next(request);

  const authStorage = inject(AuthStorageService);
  const isPublic = PUBLIC_PATHS.some((path) => request.url.startsWith(`${apiHost}${path}`));

  const headers: Record<string, string> = { Accept: 'application/json' };

  // ไม่บังคับ Content-Type ถ้าเป็นไฟล์ (FormData)
  if (!(request.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = authStorage.accessToken;
  if (!isPublic && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isPublic && authStorage.sessionUid) {
    headers['x-user-id'] = authStorage.sessionUid;
  }

  return next(request.clone({ setHeaders: headers }));
};

export const refreshTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const refreshService = inject(RefreshTokenService);
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  const isApiRequest = request.url.startsWith(`${environment.apiUrl}/`);
  const shouldSkip = PUBLIC_PATHS.some((path) => request.url.startsWith(`${environment.apiUrl}${path}`));

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isApiRequest || !isExpiredAccessToken(error) || shouldSkip) return throwError(() => error);

      return refreshService.refresh().pipe(
        // refresh ไม่สำเร็จ = หมดอายุจริง ให้ออกจากระบบ
        catchError((refreshError) => {
          authStorage.clear();
          void router.navigate(['/login'], { queryParams: { sessionExpired: true } });
          return throwError(() => refreshError);
        }),
        // refresh สำเร็จ ยิง request เดิมซ้ำด้วย token ใหม่
        switchMap((newToken) =>
          next(request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })),
        ),
      );
    }),
  );
};

function isExpiredAccessToken(error: HttpErrorResponse): boolean {
  if (error.status === 401) return true;

  const body = error.error;
  if (!body || typeof body !== 'object') return false;

  const code = body.error?.code;
  const message = body.error?.message ?? body.message;
  return code === 'ACCESS_TOKEN_VERIFICATION_FAILED' &&
    typeof message === 'string' &&
    message.toLowerCase().includes('jwt expired');
}
