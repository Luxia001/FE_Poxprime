import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { finalize, forkJoin } from 'rxjs';
import {
  Wallet as WalletData,
  WalletDetail,
  WalletType,
} from '../../../shared/models/wallet.model';
import { WalletTypeApi } from '../../../shared/services/wallet/wallet.service';
import { BarHead } from '../../../shared/components/UI/headers/bar-head/bar-head';
import { toNumber } from '../../../shared/utils/wallet.mapper';
import { TableAccount } from '../../../shared/components/UI/table/account-table/account-table.component';
import { MoneyPipe } from '../../../shared/pipes/walet.pipe';
import { ProfileApi } from '../../account/services/profile-api';
import { WalletDetailModal } from '../../../shared/components/UI/modals/wallet-detail-modal/wallet-detail-modal';
import { OpenAccountModal } from '../../../shared/components/UI/modals/open-account-modal/open-account-modal';
import { TabUI } from '../../../shared/components/UI/tabs/tab.component';
import { LucideCircleArrowDown, LucideCircleArrowUp } from '@lucide/angular';
type WalletTab = 'ALL' | 'LIVE' | 'DEMO' | 'WALLET' | 'INACTIVE';
@Component({
  imports: [
    FormsModule,
    NzSelectModule,
    BarHead,
    TableAccount,
    MoneyPipe,
    WalletDetailModal,
    OpenAccountModal,
    TabUI,
    LucideCircleArrowDown,
    LucideCircleArrowUp,
  ],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
})
export class Wallet {
  readonly profileApi = inject(ProfileApi);
  readonly profileDisplay = computed(() => {
    const response = this.profileApi.profile();
    return {
      fullName: `${response?.member.m_name} ${response?.member.m_lastname}`.trim(),
      email: response?.member.email,
      imageUrl: response?.member.m_image_url,
    };
  });
  readonly api = inject(WalletTypeApi);
  readonly selectedTypeId = signal<number | null>(null);
  readonly selectedType = signal<WalletType | null>(null);
  readonly selectedLeverages = signal<number[]>([]);
  readonly detailLoading = signal(false);
  readonly isGrid = signal(true);
  readonly activeClass =
    'bg-linear-to-r from-(--primary-theme--) to-sky-500 text-white! border-transparent';
  readonly inactiveClass = 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50';

  readonly tradingType = signal<WalletTab>('ALL');

  readonly detailError = signal('');
  readonly walletModalOpen = signal(false);
  readonly walletDetailLoading = signal(false);
  readonly walletDetailError = signal('');
  readonly selectedWallet = signal<WalletDetail | null>(null);
  readonly openAccountModal = signal(false);
  readonly totalBalance = computed(() =>
    this.api.wallets().reduce((sum, item) => sum + toNumber(item.wallet_balance), 0),
  );
  /** รายการที่แสดง กรองตาม tab (ไม่รวม main wallet ที่แสดงแยก) */
  readonly filteredWallets = computed(() => {
    const list = this.api.wallets();
    switch (this.tradingType()) {
      case 'LIVE':
        return list.filter(
          (w) => w.wallet_type === '' && w.wallet_trading_type === 'live' && w.wallet_status === 1,
        );
      case 'DEMO':
        return list.filter(
          (w) => w.wallet_type === '' && w.wallet_trading_type === 'demo' && w.wallet_status === 1,
        );
      case 'WALLET':
        return list.filter((w) => w.wallet_type !== '' && w.wallet_status === 1);
      case 'INACTIVE':
        return list.filter((w) => w.wallet_status !== 1);
      default:
        return list;
    }
  });

  constructor() {
    this.api.load();
  }

  onchangeView(grid: boolean): void {
    this.isGrid.set(grid);
  }

  openWallet(walletId: number): void {
    this.walletModalOpen.set(true);
    this.walletDetailLoading.set(true);
    this.walletDetailError.set('');
    this.selectedWallet.set(null);

    this.api
      .getWalletById(walletId)
      .pipe(finalize(() => this.walletDetailLoading.set(false)))
      .subscribe({
        next: (wallet) => this.selectedWallet.set(wallet),
        error: (error: { message?: string; error?: string | { message?: string } }) => {
          const detail = typeof error.error === 'string' ? error.error : error.error?.message;
          this.walletDetailError.set(detail || error.message || 'Unable to load wallet details.');
        },
      });
  }

  closeWalletModal(): void {
    if (this.walletDetailLoading()) return;
    this.walletModalOpen.set(false);
    this.selectedWallet.set(null);
    this.walletDetailError.set('');
  }

  accountCreated(): void {
    this.openAccountModal.set(false);
    this.api.load(true);
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
