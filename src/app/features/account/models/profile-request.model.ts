export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

/** ข้อมูล member ที่ส่งไปอัปเดต */
export interface ProfileUpdateMember {
  m_name: string;
  m_lastname: string;
  m_phone: string;
  m_phone_code: string;
  m_gender: Gender;
  m_nationality: string | null;
  m_country: string | null;
  m_identity: string | null;
  m_birthdate: string | null; // รูปแบบ 'YYYY-MM-DD'
}

/** ข้อมูล address ที่ส่งไปอัปเดต */
export interface ProfileUpdateAddress {
  address_no: string | null;
  address_district: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zipcode: string | null;
}

/** Request body ของ PUT/PATCH profile */
export interface ProfileUpdateRequest {
  member: ProfileUpdateMember;
  address: ProfileUpdateAddress;
}

/** member ที่ response ส่งกลับมา (มี field ที่ server เป็นเจ้าของ) */
export interface ProfileUpdatedMember extends ProfileUpdateMember {
  id: number;
  username: string;
  email: string;
  m_image_url: string;
}

export interface ProfileUpdateData {
  member: ProfileUpdatedMember;
  address: ProfileUpdateAddress;
}

export interface ProfileUpdateSuccessResponse {
  result: true;
  message: string;
  data: ProfileUpdateData;
  code: number;
}

export interface ProfileUpdateErrorResponse {
  result: false;
  message: string;
  error?: string;
  errors?: unknown[];
  code: number;
}

export type ProfileUpdateResponse = ProfileUpdateSuccessResponse | ProfileUpdateErrorResponse;
