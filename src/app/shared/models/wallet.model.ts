import { errorResponse, successResponse } from '../../core/models/index.model';

export type AccountKind = 'live' | 'demo';
export interface WalletType {
  id: number;
  account_type: AccountKind;
  category?: number; // มีเฉพาะจาก account-types
  account_name: string;
  account_group: string;
  account_path: string;
  account_leverage: number[];
  account_limit: number;
  account_min_deposit: number;
  account_max_deposit: number;
  account_socialtrade: number;
  account_status: number;
  account_admin_access: number;
  account_currency: string;
  account_rate: number;
  admin_id: number | null;
  createdAt: string;
  updatedAt: string;
}
export type WalletTypeRaw = Omit<
  WalletType,
  'account_leverage' | 'account_min_deposit' | 'account_max_deposit'
> & {
  account_leverage: number[] | string;
  account_min_deposit: number | string;
  account_max_deposit: number | string;
};
export interface WalletTypesSuccessResponse extends successResponse {
  data: WalletTypeRaw[];
}
export interface WalletTypeSuccessResponse extends successResponse {
  data: WalletTypeRaw;
}
export interface AccountTypesSuccessResponse extends successResponse {
  data: WalletTypeRaw[];
}

export type WalletTypesResponse = WalletTypesSuccessResponse | errorResponse;

export type WalletTypeResponse = WalletTypeSuccessResponse | errorResponse;
export interface LeveragesData {
  account_type_id: number;
  leverages: number[];
}

export interface LeveragesSuccessResponse extends successResponse {
  data: LeveragesData;
}

export type LeveragesResponse = LeveragesSuccessResponse | errorResponse;

export type AccountTypesResponse = AccountTypesSuccessResponse | errorResponse;

export type WalletKind = 'main' | 'rebate' | 'lot' | 'point' | '';

export interface Wallet {
  id: number;
  member_id: number;
  wallet_type: WalletKind; // '' = บัญชีเทรด (ไม่ใช่กระเป๋าระบบ)
  wallet_trading_type: 'live' | 'demo';
  wallet_account_name: string;
  wallet_account_no: string;
  wallet_account_type: string | null; // id ของ wallet-types เป็น string ("2")
  wallet_account_type_name: string | null;
  wallet_account_group: string | null;
  wallet_leverage: number | null;
  wallet_balance: string; // เงินเป็น string เช่น "0.00"
  wallet_credit: string;
  wallet_margin: string;
  wallet_equity: string;
  wallet_iv: string | null;
  wallet_symbol_us: string;
  wallet_symbol_th: string;
  wallet_currency: string;
  wallet_server: string | null;
  wallet_status: number; // 1 = ใช้งาน, 0 = ปิด
  is_deposit: number; // 0/1
  is_withdraw: number;
  is_tran_in: number;
  is_tran_out: number;
  is_leverage: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface WalletsSuccessResponse extends successResponse {
  data: Wallet[];
}

export type WalletsResponse = WalletsSuccessResponse | errorResponse;

export interface WalletDetail {
  id: number;
  member_id: number;
  wallet_type: WalletKind;
  wallet_trading_type: 'live' | 'demo';
  wallet_account_name: string;
  wallet_account_no: string;
  wallet_account_type: string | null;
  wallet_account_type_name: string | null;
  wallet_account_group: string | null;
  wallet_leverage: number | null;
  wallet_balance: number;
  wallet_credit: number;
  wallet_margin: number;
  wallet_equity: number;
  wallet_iv: string | null;
  wallet_symbol_us: string;
  wallet_symbol_th: string;
  wallet_currency: string;
  wallet_server: string | null;
  wallet_status: number;
  wallet_master_type: string;
  wallet_master_no: string | null;
  wallet_master_name: string | null;
  wallet_following_name: string | null;
  wallet_rights: number;
  wallet_deposit_max: number;
  createdAt: string;
  updatedAt: string | null;
  isWithdraw: number;
  isDeposit: number;
  isTranIn: number;
  isTranOut: number;
  isLeverage: number;
  isTrading: number;
  isTradingEnabled: number;
  // ไม่ประกาศ password/IP/admin field: UI ไม่ควรแตะ
}

export interface WalletDetailSuccessResponse extends successResponse {
  data: WalletDetail;
}
export type WalletDetailResponse = WalletDetailSuccessResponse | errorResponse;

export interface CreateLiveWalletRequest {
  wallet_account_name: string;
  wallet_account_type: number;
  wallet_leverage: number;
  wallet_trading_type: 'live';
  wallet_master_password?: string;
}

export interface CreateDemoWalletRequest {
  wallet_account_name: string;
  wallet_account_type: number;
  wallet_leverage: number;
  wallet_trading_type: 'demo';
  wallet_balance: number;

  wallet_account_no?: string | number;
  isDeposit: number;
  isWithdraw: number;
  isTranIn: number;
  isTranOut: number;
  wallet_symbol_us: string;
  wallet_symbol_th: string;
}

export type CreateWalletRequest = CreateLiveWalletRequest | CreateDemoWalletRequest;

export interface CreateWalletSuccessResponse extends successResponse {
  data: WalletDetail | Wallet;
}

export type CreateWalletResponse = CreateWalletSuccessResponse | errorResponse;
