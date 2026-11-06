import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BankAccount, BankAccountRequest, BankAccountResponse } from '../models/bookbank.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BankAccountApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/member/bank-account`;

  private readonly accountsState = signal<BankAccount[]>([]);
  readonly accounts = this.accountsState.asReadonly();

  add(request: BankAccountRequest): Observable<BankAccount> {
    return this.http.post<BankAccountResponse>(`${this.baseUrl}/add`, request).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res.data;
      }),
      tap((account) => this.accountsState.update((list) => [...list, account])),
    );
  }

  clear(): void {
    this.accountsState.set([]);
  }
}
