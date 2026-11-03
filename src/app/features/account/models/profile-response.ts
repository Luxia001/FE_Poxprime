export interface ProfileMember {
  id: number;
  username: string;
  email: string;
  m_image_url: string;
  m_name: string;
  m_lastname: string;
  m_phone: string;
  m_phone_code: string;
  m_gender: 'MALE' | 'FEMALE' | 'OTHER';
  m_nationality: string | null;
  m_country: string | null;
  m_state: string | null;
  m_identity: string | null;
  isActive: number;
  isConfirm: number;
  isKYC: number;
  campaign_name: string | null;
  lastLogin: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
  ib: number;
  ibType: number;
  mt5_category: number;
  member_roles: string[];
}

export interface ProfileAddress {
  id: number;
  member_id: number;
  address_no: string | null;
  address_district: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zipcode: string | null;
  address_stat: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  member: ProfileMember;
  address: ProfileAddress;
  isTrusted: boolean;
}

export interface ProfileSuccessResponse {
  result: true;
  message: string;
  data: ProfileData;
  code: number;
}

export interface ProfileErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type ProfileResponse = ProfileSuccessResponse | ProfileErrorResponse;

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  country: string | null;
  imageUrl: string;
  isKYC: boolean;
  isTrusted: boolean;
  createdAt: Date;
}
