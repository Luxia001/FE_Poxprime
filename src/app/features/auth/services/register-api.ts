import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterRequest } from '../models/register-request';
import {
  RegisterErrorResponse,
  RegisterResponse,
  RegisterSuccessResponse,
} from '../models/register-response';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegisterApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/v1/member/register`;

  register(request: RegisterRequest): Observable<RegisterSuccessResponse> {
    return this.http.post<RegisterResponse>(this.endpoint, request).pipe(
      map((response) => {
        if (!response.result) throw response;
        return response;
      }),
      catchError((response: HttpErrorResponse) => throwError(() => this.normalizeError(response))),
    );
  }

  private normalizeError(
    response: HttpErrorResponse | RegisterErrorResponse,
  ): RegisterErrorResponse {
    if (!(response instanceof HttpErrorResponse)) return response;
    const body = response.error;
    if (body && typeof body === 'object' && body.result === false) {
      return {
        result: false,
        message: typeof body.message === 'string' ? body.message : 'Registration failed',
        error: body.error,
        errors: Array.isArray(body.errors) ? body.errors : undefined,
        code: typeof body.code === 'number' ? body.code : response.status,
      };
    }

    return {
      result: false,
      message:
        response.status === 0
          ? 'Unable to connect to the registration service'
          : response.message || 'Registration failed',
      code: response.status,
    };
  }
}
