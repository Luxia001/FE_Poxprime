import { Component, input } from '@angular/core';
import { Wallet } from '../../../../models/wallet.model';
import { MoneyPipe, WalletTypeLabelPipe } from '../../../../pipes/walet.pipe';

@Component({
  imports: [MoneyPipe, WalletTypeLabelPipe],
  selector: 'table-account',
  styleUrl: './account-table.component.css',
  templateUrl: './account-table.component.html',
})
export class TableAccount {
  readonly wallets = input<Wallet[]>([]);
  readonly coloumns = input<string[]>([]);
}
