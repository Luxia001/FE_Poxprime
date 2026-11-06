import { errorResponse, successResponse } from '../../core/models/index.model';

export interface SendSmsOtpData {
  memberRef: string;
  expiresAt: number;
}

export interface SendSmsOtpSuccessResponse extends successResponse {
  data: SendSmsOtpData;
}

export type SendSmsOtpResponse = SendSmsOtpSuccessResponse | errorResponse;

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

export interface VerifySmsOtpSuccessResponse extends successResponse {
  data?: VerifySmsOtpData;
}

export type VerifySmsOtpResponse = VerifySmsOtpSuccessResponse | errorResponse;
