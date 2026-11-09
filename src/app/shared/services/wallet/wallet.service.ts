import { finalize, forkJoin, map, Observable } from 'rxjs';
import {
  AccountTypesResponse,
  LeveragesResponse,
  Wallet,
  WalletDetailResponse,
  WalletsResponse,
  WalletType,
  WalletTypeResponse,
  WalletTypesResponse,
} from '../../models/wallet.model';
import { toWalletType } from '../../utils/wallet.mapper';
import { errorResponse } from '../../../core/models/index.model';
import { getErrorMessage } from '../../../core/utils/error-message';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { detailToWallet } from '../../DTOs/wallet/walletDetail.dto';

@Injectable({ providedIn: 'root' })
export class WalletTypeApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/trading`;

  private readonly typesState = signal<WalletType[]>([]);
  private readonly accountTypesState = signal<WalletType[]>([]);
  private readonly walletsState = signal<Wallet[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal('');

  readonly types = this.typesState.asReadonly();
  readonly accountTypes = this.accountTypesState.asReadonly();
  readonly wallets = this.walletsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly activeTypes = computed(() => this.typesState().filter((t) => t.account_status === 1));
  readonly liveTypes = computed(() => this.activeTypes().filter((t) => t.account_type === 'live'));
  readonly demoTypes = computed(() => this.activeTypes().filter((t) => t.account_type === 'demo'));

  load(force = false): void {
    if (this.loadingState() || (!force && (this.typesState().length || this.walletsState().length)))
      return;
    this.loadingState.set(true);
    this.errorState.set('');

    forkJoin({
      types: this.http.get<WalletTypesResponse>(`${this.base}/wallet-types`),
      accountTypes: this.http.get<AccountTypesResponse>(`${this.base}/account-types`),
      wallets: this.http.get<WalletsResponse>(this.base),
    })
      .pipe(
        map((res) => {
          if (!res.types.result) throw res.types;
          if (!res.accountTypes.result) throw res.accountTypes;
          if (!res.wallets.result) throw res.wallets;
          return {
            types: res.types.data.map(toWalletType),
            accountTypes: res.accountTypes.data.map(toWalletType),
            wallets: res.wallets.data,
          };
        }),
        finalize(() => this.loadingState.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.typesState.set(data.types);
          this.accountTypesState.set(data.accountTypes);
          this.walletsState.set(data.wallets);
        },
        error: (err: errorResponse) =>
          this.errorState.set(getErrorMessage(err, 'Unable to load account types.')),
      });
  }

  getById(id: number): Observable<WalletType> {
    return this.http.get<WalletTypeResponse>(`${this.base}/wallet-type/${id}`).pipe(
      map((res) => {
        if (!res.result) throw res;
        return toWalletType(res.data);
      }),
    );
  }

  getLeverages(typeId: number): Observable<number[]> {
    return this.http.get<LeveragesResponse>(`${this.base}/wallet-type/${typeId}/leverages`).pipe(
      map((res) => {
        if (!res.result) throw res;
        return res.data.leverages;
      }),
    );
  }

  getWalletById(id: number): Observable<Wallet> {
    return this.http.get<WalletDetailResponse>(`${this.base}/${id}`).pipe(
      map((res) => {
        if (!res.result) throw res;
        return detailToWallet(res.data);
      }),
    );
  }

  clear(): void {
    this.typesState.set([]);
    this.accountTypesState.set([]);
    this.walletsState.set([]);
    this.errorState.set('');
  }
}
