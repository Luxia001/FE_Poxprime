import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStorageService } from './auth-storage';
import { RefreshTokenRequest, RefreshTokenResponse } from '../models/token.model';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService {
  private readonly http = inject(HttpClient);
  private readonly authStorage = inject(AuthStorageService);

  private readonly endpoint = `${environment.apiUrl}/v1/auth/refresh`;

  // เก็บ request ที่กำลังทำงานอยู่ เพื่อไม่ให้ refresh ซ้อนกันหลายครั้ง
  private inFlight$: Observable<string> | null = null;

  /** คืน accessToken ใหม่ */
  refresh(): Observable<string> {
    if (this.inFlight$) return this.inFlight$;

    const refreshToken = this.authStorage.refreshToken;
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    const body: RefreshTokenRequest = { refreshToken };

    this.inFlight$ = this.http.post<RefreshTokenResponse>(this.endpoint, body).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res.data;
      }),
      tap((data) =>
        this.authStorage.save({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || this.authStorage.refreshToken,
          sessionUid: data.sessionUid || this.authStorage.sessionUid,
        }),
      ),
      map((data) => data.accessToken),
      finalize(() => (this.inFlight$ = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.inFlight$;
  }
}
