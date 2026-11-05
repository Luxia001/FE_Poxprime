import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map } from 'rxjs';
import { ActiveSession, ActiveSessionsResponse, Pagination } from '../models/session.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/v1/auth/sessions/active`;

  private readonly sessionsState = signal<ActiveSession[]>([]);
  private readonly paginationState = signal<Pagination | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal('');

  readonly sessions = this.sessionsState.asReadonly();
  readonly pagination = this.paginationState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  load(page = 1, limit = 10): void {
    this.loadingState.set(true);
    this.errorState.set('');

    const params = new HttpParams().set('page', page).set('limit', limit);

    this.http
      .get<ActiveSessionsResponse>(this.endpoint, { params })
      .pipe(
        map((res) => {
          if (!res.result) throw res;
          return res;
        }),
        finalize(() => this.loadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.sessionsState.set(res.data);
          this.paginationState.set(res.pagination);
        },
        error: (err: { message?: string }) =>
          this.errorState.set(err.message ?? 'Failed to load sessions'),
      });
  }

  clear(): void {
    this.sessionsState.set([]);
    this.paginationState.set(null);
    this.errorState.set('');
  }
}
