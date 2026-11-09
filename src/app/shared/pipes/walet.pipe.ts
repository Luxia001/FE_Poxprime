import { Pipe, PipeTransform } from '@angular/core';
import { pipe } from 'rxjs';
import { toNumber } from '../utils/wallet.mapper';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    return toNumber(value ?? 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

@Pipe({ name: 'walletTypeLabel' })
export class WalletTypeLabelPipe implements PipeTransform {
  transform(type: string | null | undefined): string {
    if (!type) return 'Trading';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
