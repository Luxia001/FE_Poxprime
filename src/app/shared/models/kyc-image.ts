export interface KycUploadData {
  kycIdType: string;
  imageUrl: string; // signed URL หมดอายุใน 1800 วินาที (30 นาที)
}
export type KycIdType = 'National ID card' | 'Passport';
export interface KycUploadSuccessResponse {
  result: true;
  message: string;
  data: KycUploadData;
  code: number;
}

export interface KycUploadErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type KycUploadResponse = KycUploadSuccessResponse | KycUploadErrorResponse;
