export interface KycRecord {
  id: number;
  member_id: number;
  kyc_type: string; // 'id' (ถ้ามี passport ฯลฯ ให้เปลี่ยนเป็น union)
  kyc_id: string | null;
  kyc_id_type: string | null;
  kyc_image: string;
  kyc_image_url: string;
  kyc_image_session: number;
  kyc_stat: number;
  kyc_stat_text: string; // 'None' ฯลฯ ห้ามใช้แสดงผลตรงๆ เพราะไม่รองรับหลายภาษา
  kyc_reason: string;
  kyc_note: string; // 'OTPVerified'
  admin_id: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface KycSuccessResponse {
  result: true;
  message: string;
  data: KycRecord;
  code: number;
}

export interface KycErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type KycResponse = KycSuccessResponse | KycErrorResponse;
