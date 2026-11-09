import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { finalize, forkJoin } from 'rxjs';
import { WalletType } from '../../../shared/models/wallet.model';
import { WalletTypeApi } from '../../../shared/services/wallet/wallet.service';
import { BarHead } from '../../../shared/components/UI/headers/bar-head/bar-head';
import { toNumber } from '../../../shared/utils/wallet.mapper';
import { TableAccount } from '../../../shared/components/UI/table/account-table/account-table.component';
import { MoneyPipe } from '../../../shared/pipes/walet.pipe';

@Component({
  imports: [FormsModule, NzSelectModule, BarHead, TableAccount, MoneyPipe],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
})
export class Wallet {
  readonly api = inject(WalletTypeApi);
  readonly selectedTypeId = signal<number | null>(null);
  readonly selectedType = signal<WalletType | null>(null);
  readonly selectedLeverages = signal<number[]>([]);
  readonly detailLoading = signal(false);
  readonly isGrid = signal(false);
  readonly activeClass =
    'bg-linear-to-r from-(--primary-theme--) to-sky-500 text-white! border-transparent';
  readonly inactiveClass = 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50';

  readonly detailError = signal('');
  readonly totalBalance = computed(() =>
    this.api.wallets().reduce((sum, item) => sum + toNumber(item.wallet_balance), 0),
  );
  readonly activeWallets = computed(
    () => this.api.wallets().filter((item) => item.wallet_status === 1).length,
  );
  readonly mainWallet = computed(
    () => this.api.wallets().find((wallet) => wallet.wallet_type === 'main') ?? null,
  );
  readonly otherWallets = computed(() =>
    this.api.wallets().filter((wallet) => wallet.wallet_type !== 'main'),
  );
  constructor() {
    this.api.load();
  }

  onchangeView(grid: boolean): void {
    this.isGrid.set(grid);
  }

  selectType(typeId: number | null): void {
    this.selectedTypeId.set(typeId);
    this.selectedType.set(null);
    this.selectedLeverages.set([]);
    this.detailError.set('');
    if (typeId === null) return;
    this.detailLoading.set(true);
    forkJoin({ type: this.api.getById(typeId), leverages: this.api.getLeverages(typeId) })
      .pipe(finalize(() => this.detailLoading.set(false)))
      .subscribe({
        next: ({ type, leverages }) => {
          this.selectedType.set(type);
          this.selectedLeverages.set(leverages);
        },
        error: (error: { message?: string; error?: string | { message?: string } }) => {
          const detail = typeof error.error === 'string' ? error.error : error.error?.message;
          this.detailError.set(detail || error.message || 'Unable to load account type details.');
        },
      });
  }
}
