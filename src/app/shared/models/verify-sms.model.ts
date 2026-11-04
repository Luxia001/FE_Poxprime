export interface SendSmsOtpData {
  memberRef: string;
  expiresAt: number;
}

export interface SendSmsOtpSuccessResponse {
  result: true;
  message: string;
  data: SendSmsOtpData;
  code: number;
}

export interface SendSmsOtpErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type SendSmsOtpResponse = SendSmsOtpSuccessResponse | SendSmsOtpErrorResponse;

export interface SendSmsOtpRequest {
  phoneCode: string;
  phoneNumber: string;
}

export type VerifyPurpose = 'KYC';

export interface VerifySmsOtpRequest {
  memberRef: string;
  otpCode: string;
  optional: VerifyPurpose;
}

export interface VerifySmsOtpData {
  verified?: boolean;
}

export interface VerifySmsOtpSuccessResponse {
  result: true;
  message: string;
  data?: VerifySmsOtpData;
  code: number;
}

export interface VerifySmsOtpErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type VerifySmsOtpResponse = VerifySmsOtpSuccessResponse | VerifySmsOtpErrorResponse;
