import { WalletType, WalletTypeRaw } from '../models/wallet.model';

const toNumber = (v: number | string): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
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
