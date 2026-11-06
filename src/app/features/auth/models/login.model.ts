import { errorResponse, successResponse } from '../../../core/models/index.model';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginMember {
  id: number;
  username: string;
  email: string;
  m_image_url: string;
  m_image_path: string;
  m_name: string;
  m_lastname: string;
  isKYC: number;
  ib: number;
  ibType: number;
  mt5_category: number;
  member_roles: string[]; // ปรับตามโครงสร้างจริงถ้า role เป็น object
}

export interface LoginData {
  require2FA: false;
  member: LoginMember;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // มิลลิวินาที (900000 = 15 นาที)
  sessionUid: string;
}

export interface LoginTwoFactorData {
  require2FA: true;
  preAuthToken: string;
}

export interface LoginSuccessResponse {
  result: true;
  message: string;
  data: LoginData | LoginTwoFactorData;
  code: number;
}

export type LoginResponse = LoginSuccessResponse | errorResponse;

export interface TwoFactorVerifyRequest {
  preAuthToken: string;
  totpToken: string;
  rememberDevice: boolean;
}

export interface TwoFactorVerifySuccessResponse extends successResponse {
  data: LoginData;
}

export type TwoFactorVerifyResponse = TwoFactorVerifySuccessResponse | errorResponse;
