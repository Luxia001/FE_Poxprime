import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { KycRecord, KycResponse } from '../../models/kyc.model';
import { finalize, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KycApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/v1/verify/kyc`;

  private readonly kycState = signal<KycRecord | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal('');

  readonly kyc = this.kycState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  load(): void {
    this.loadingState.set(true);
    this.errorState.set('');

    this.http
      .get<KycResponse>(this.endpoint)
      .pipe(
        map((res) => {
          if (!res.result) throw res;
          return res.data;
        }),
        finalize(() => this.loadingState.set(false)),
      )
      .subscribe({
        next: (data) => this.kycState.set(data),
        error: (err: { message?: string }) =>
          this.errorState.set(err.message ?? 'Failed to load KYC'),
      });
  }

  clear(): void {
    this.kycState.set(null);
    this.errorState.set('');
  }
}
