import { WalletType, WalletTypeRaw } from '../models/wallet.model';

export const toNumber = (value: number | string): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const toLeverages = (v: number[] | string): number[] => {
  if (Array.isArray(v)) return v;
  try {
    const parsed: unknown = JSON.parse(v);
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
      : [];
  } catch {
    return [];
  }
};

export const toWalletType = (raw: WalletTypeRaw): WalletType => ({
  ...raw,
  account_leverage: toLeverages(raw.account_leverage),
  account_min_deposit: toNumber(raw.account_min_deposit),
  account_max_deposit: toNumber(raw.account_max_deposit),
});
