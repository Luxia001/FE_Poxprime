import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  LoginSuccessResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
  TwoFactorVerifySuccessResponse,
} from '../models/login.model';
import { errorResponse } from '../../../core/models/index.model';

@Injectable({ providedIn: 'root' })
export class LoginApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/v1/auth/login`;
  private readonly twoFactorEndpoint = `${environment.apiUrl}/v1/auth/2fa/verify`;

  login(request: LoginRequest): Observable<LoginSuccessResponse> {
    return this.http.post<LoginResponse>(this.endpoint, request).pipe(
      map((response) => {
        if (!response.result) throw response;
        return response;
      }),
      catchError((response: HttpErrorResponse | errorResponse) =>
        throwError(() => this.normalizeError(response)),
      ),
    );
  }

  verifyTwoFactor(request: TwoFactorVerifyRequest): Observable<TwoFactorVerifySuccessResponse> {
    return this.http.post<TwoFactorVerifyResponse>(this.twoFactorEndpoint, request).pipe(
      map((response) => {
        if (!response.result) throw response;
        return response;
      }),
      catchError((response: HttpErrorResponse | errorResponse) =>
        throwError(() => this.normalizeError(response)),
      ),
    );
  }

  private normalizeError(response: HttpErrorResponse | errorResponse): errorResponse {
    if (!(response instanceof HttpErrorResponse)) return response;
    const body = response.error;
    if (body && typeof body === 'object' && body.result === false) {
      return {
        result: false,
        message: typeof body.message === 'string' ? body.message : 'Login failed',
        error: typeof body.error === 'string' ? body.error : body.error?.message,
        errors: Array.isArray(body.errors) ? body.errors : undefined,
        code: typeof body.code === 'number' ? body.code : response.status,
      };
    }
    return {
      result: false,
      message: response.status === 0 ? 'Unable to connect to the login service' : 'Login failed',
      error: response.message,
      code: response.status,
    };
  }
}
