import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { EmailVerificationData, EmailVerificationResponse } from '../../../shared/models/verify-email.model';

@Injectable({ providedIn: 'root' })
export class EmailVerificationApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/member/verification`;

  verify(token: string): Observable<EmailVerificationData> {
    return this.http
      .get<EmailVerificationResponse>(`${this.baseUrl}/${encodeURIComponent(token)}`)
      .pipe(
        map((res) => {
          if (!res.result) throw res;
          return res.data;
        }),
      );
  }
}
