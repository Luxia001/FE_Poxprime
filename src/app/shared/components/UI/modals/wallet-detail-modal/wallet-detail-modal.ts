import { Component, input, output } from '@angular/core';
import { Wallet } from '../../../../models/wallet.model';
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
  readonly wallet = input<Wallet | null>(null);
  readonly fullName = input('');
  readonly imageUrl = input('');
  readonly closed = output<void>();
  readonly deposit = output<Wallet>();
  readonly withdraw = output<Wallet>();
}
