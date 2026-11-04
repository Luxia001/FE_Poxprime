import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { ProfileData, ProfileErrorResponse, ProfileResponse } from '../models/profile-response';
import {
  ProfileUpdateRequest,
  ProfileUpdateErrorResponse,
  ProfileUpdateResponse,
  ProfileUpdateSuccessResponse,
} from '../models/profile-request.model';
@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/v1/member/profile`;
  private readonly profileState = signal<ProfileData | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal('');

  readonly profile = this.profileState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly initials = computed(() => {
    const profile = this.profileState();
    if (!profile) return '';
    return `${profile.member.m_name.charAt(0)}${profile.member.m_lastname.charAt(0)}`.toUpperCase();
  });

  loadProfile(force = false): void {
    if (this.loadingState() || (!force && this.profileState())) return;
    this.loadingState.set(true);
    this.errorState.set('');
    this.getProfile()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: (profile) => this.profileState.set(profile),
        error: (error: ProfileErrorResponse) => {
          this.profileState.set(null);
          this.errorState.set(error.error || error.message || 'Unable to load profile');
        },
      });
  }

  clear(): void {
    this.profileState.set(null);
    this.errorState.set('');
    this.loadingState.set(false);
  }

  getProfile(): Observable<ProfileData> {
    return this.http.get<ProfileResponse>(this.endpoint).pipe(
      map((response) => {
        if (!response.result) throw response;
        return response.data;
      }),
      catchError((response: HttpErrorResponse | ProfileErrorResponse) =>
        throwError(() => this.normalizeError(response)),
      ),
    );
  }

  private normalizeError(response: HttpErrorResponse | ProfileErrorResponse): ProfileErrorResponse {
    if (!(response instanceof HttpErrorResponse)) return response;
    const body = response.error;
    if (body && typeof body === 'object' && body.result === false) {
      return {
        result: false,
        message: typeof body.message === 'string' ? body.message : 'Unable to load profile',
        error: typeof body.error === 'string' ? body.error : body.error?.message,
        code: typeof body.code === 'number' ? body.code : response.status,
      };
    }
    return {
      result: false,
      message:
        response.status === 0
          ? 'Unable to connect to the profile service'
          : 'Unable to load profile',
      error: response.message,
      code: response.status,
    };
  }

  updateProfile(request: ProfileUpdateRequest): Observable<ProfileUpdateSuccessResponse> {
    return this.http.put<ProfileUpdateResponse>(this.endpoint + '/update', request).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res;
      }),
      catchError((response: HttpErrorResponse | ProfileUpdateErrorResponse) => {
        if (!(response instanceof HttpErrorResponse)) return throwError(() => response);
        const body = response.error;
        const error: ProfileUpdateErrorResponse =
          body && typeof body === 'object' && body.result === false
            ? {
                result: false,
                message: typeof body.message === 'string' ? body.message : 'Profile update failed',
                error: typeof body.error === 'string' ? body.error : body.error?.message,
                errors: Array.isArray(body.errors) ? body.errors : undefined,
                code: typeof body.code === 'number' ? body.code : response.status,
              }
            : {
                result: false,
                message: 'Profile update failed',
                error: response.message,
                code: response.status,
              };
        return throwError(() => error);
      }),
    );
  }
}
