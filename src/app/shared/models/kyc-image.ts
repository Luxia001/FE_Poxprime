import { errorResponse, successResponse } from '../../core/models/index.model';

export interface KycUploadData {
  kycIdType: string;
  imageUrl: string; // signed URL หมดอายุใน 1800 วินาที (30 นาที)
}
export type KycIdType = 'National ID card' | 'Passport';

export interface KycUploadSuccessResponse extends successResponse {
  data: KycUploadData;
}

export type KycUploadResponse = KycUploadSuccessResponse | errorResponse;
