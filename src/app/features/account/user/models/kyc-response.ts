export interface KycRecord {
  id: number;
  memberId: number;
  kyc_type: string;
  kyc_id_type: string;
  kyc_image_url: string;
  kyc_stat: number;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface KycResponse {
  result: boolean;
  message: string;
  data: KycRecord;
  code: number;
}
