export interface BankAccountRequest {
  bank_name: string;
  bank_branch: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
  bank_image?: string; // URL ของโลโก้ธนาคาร
}

export interface BankAccount {
  id: number;
  member_id: number;
  ref_id: string | null;
  cus_id: string | null;
  bank_name: string;
  bank_branch: string | null;
  bank_code: string;
  bank_account_number: string;
  bank_image: string | null;
  bank_account_name: string;
  bank_swiftcode: string | null;
  bank_country: string | null;
  bank_currency: string | null;
  bank_status: number;
  bank_status_text: string;
  bank_note: string;
  admin_id: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountSuccessResponse {
  result: true;
  message: string;
  data: BankAccount;
  code: number;
}

export interface BankAccountErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type BankAccountResponse = BankAccountSuccessResponse | BankAccountErrorResponse;
