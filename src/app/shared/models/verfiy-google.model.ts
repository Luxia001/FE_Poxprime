import { errorResponse, successResponse } from '../../core/models/index.model';

export interface TotpSetupData {
  secret: string;
  qrCodeUrl: string; // จริงๆ คือ otpauth:// URI ไม่ใช่รูปภาพ ต้องเอาไปสร้าง QR เอง
  backupCodes: string[];
}

export interface TotpSetupSuccessResponse extends successResponse {
  data: TotpSetupData;
}

export type TotpSetupResponse = TotpSetupSuccessResponse | errorResponse;

export interface TotpVerifySuccessResponse extends successResponse {
  data?: { verified?: boolean; backupCodes?: string[] };
}

export type TotpVerifyResponse = TotpVerifySuccessResponse | errorResponse;

export interface TotpVerifySetupRequest {
  token: string; // รหัส 6 หลักจากแอป ต้องเป็น string เพื่อไม่ให้ 0 นำหน้าหาย
}

export type TotpVerifySetupResponse = successResponse | errorResponse;

export interface TotpStatusData {
  isEnabled: boolean;
  isSetupPending: boolean; // เริ่ม setup แล้วแต่ยังไม่ verify-setup
}

export interface TotpStatusSuccessResponse extends successResponse {
  data: TotpStatusData;
}

export type TotpStatusResponse = TotpStatusSuccessResponse | errorResponse;
