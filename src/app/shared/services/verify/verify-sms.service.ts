import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SendSmsOtpData,
  SendSmsOtpResponse,
  VerifySmsOtpRequest,
  VerifySmsOtpResponse,
  VerifySmsOtpSuccessResponse,
} from '../../models/verify-sms.model';

@Injectable({ providedIn: 'root' })
export class VerifyApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/v1/verify/sms/send`;
  private readonly verifyEndpoint = `${environment.apiUrl}/v1/verify/sms/verify`;

  sendSmsOtp(): Observable<SendSmsOtpData> {
    return this.http.post<SendSmsOtpResponse>(this.endpoint, {}).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res.data;
      }),
    );
  }

  verifySmsOtp(request: VerifySmsOtpRequest): Observable<VerifySmsOtpSuccessResponse> {
    return this.http.post<VerifySmsOtpResponse>(this.verifyEndpoint, request).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res;
      }),
    );
  }
}
