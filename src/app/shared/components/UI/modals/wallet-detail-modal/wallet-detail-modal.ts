import { Component, input, output } from '@angular/core';
import { WalletDetail, WalletType } from '../../../../models/wallet.model';
import { MoneyPipe, WalletTypeLabelPipe } from '../../../../pipes/walet.pipe';

@Component({
  selector: 'app-wallet-detail-modal',
  imports: [MoneyPipe, WalletTypeLabelPipe],
  templateUrl: './wallet-detail-modal.html',
})
export class WalletDetailModal {
  readonly open = input(false);
  readonly loading = input(false);
  readonly error = input('');
  readonly wallet = input<WalletDetail | null>(null);
  readonly accountTypes = input<WalletType[]>([]);
  readonly fullName = input('');
  readonly imageUrl = input('');
  readonly closed = output<void>();
  readonly deposit = output<boolean>();
  readonly withdraw = output<boolean>();

  accountTypeName(accountTypeId: string | null): string {
    if (!accountTypeId) return '-';
    return (
      this.accountTypes().find((accountType) => accountType.id === Number(accountTypeId))
        ?.account_name ?? `Type #${accountTypeId}`
    );
  }
}
