import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  TotpSetupData,
  TotpSetupResponse,
  TotpStatusData,
  TotpStatusResponse,
  TotpVerifySetupRequest,
  TotpVerifySetupResponse,
} from '../../models/verfiy-google.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TotpApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/verify/totp`;

  private readonly statusState = signal<TotpStatusData | null>(null);
  private readonly statusLoadingState = signal(false);
  private readonly statusErrorState = signal('');
  readonly status = this.statusState.asReadonly();
  readonly statusLoading = this.statusLoadingState.asReadonly();
  readonly statusError = this.statusErrorState.asReadonly();

  setup(): Observable<TotpSetupData> {
    return this.http.post<TotpSetupResponse>(`${this.baseUrl}/setup`, {}).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res.data;
      }),
    );
  }

  verifySetup(token: string): Observable<void> {
    const body: TotpVerifySetupRequest = { token };

    return this.http.post<TotpVerifySetupResponse>(`${this.baseUrl}/verify-setup`, body).pipe(
      map((res) => {
        if (!res.result) throw res;
      }),
    );
  }

  loadStatus(): void {
    this.statusLoadingState.set(true);
    this.statusErrorState.set('');
    this.http
      .get<TotpStatusResponse>(`${this.baseUrl}/status`)
      .pipe(
        map((res) => {
          if (!res.result) throw res;
          return res.data;
        }),
      )
      .subscribe({
        next: (data) => {
          this.statusState.set(data);
          this.statusLoadingState.set(false);
        },
        error: (error: { message?: string }) => {
          this.statusState.set(null);
          this.statusLoadingState.set(false);
          this.statusErrorState.set(error.message ?? 'Unable to load authenticator status.');
        },
      });
  }

  clear(): void {
    this.statusState.set(null);
    this.statusLoadingState.set(false);
    this.statusErrorState.set('');
  }
}
