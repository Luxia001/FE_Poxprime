export interface TotpSetupData {
  secret: string;
  qrCodeUrl: string; // จริงๆ คือ otpauth:// URI ไม่ใช่รูปภาพ ต้องเอาไปสร้าง QR เอง
  backupCodes: string[];
}

export interface TotpSetupSuccessResponse {
  result: true;
  message: string;
  data: TotpSetupData;
  code: number;
}

export interface TotpSetupErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type TotpSetupResponse = TotpSetupSuccessResponse | TotpSetupErrorResponse;


export interface TotpVerifySuccessResponse {
  result: true;
  message: string;
  data?: { verified?: boolean; backupCodes?: string[] };
  code: number;
}

export interface TotpVerifyErrorResponse {
  result: false;
  message: string;
  error?: string | { code?: string; message?: string };
  code: number;
}

export type TotpVerifyResponse = TotpVerifySuccessResponse | TotpVerifyErrorResponse;

export interface TotpVerifySetupRequest {
  token: string; // รหัส 6 หลักจากแอป ต้องเป็น string เพื่อไม่ให้ 0 นำหน้าหาย
}

export interface TotpVerifySetupSuccessResponse {
  result: true;
  message: string;
  code: number;
}

export type TotpVerifySetupResponse = TotpVerifySetupSuccessResponse | TotpVerifyErrorResponse;

export interface TotpStatusData {
  isEnabled: boolean;
  isSetupPending: boolean; // เริ่ม setup แล้วแต่ยังไม่ verify-setup
}

export interface TotpStatusSuccessResponse {
  result: true;
  message: string;
  code: number;
  data: TotpStatusData;
}

export type TotpStatusResponse = TotpStatusSuccessResponse | TotpVerifyErrorResponse;
