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
  require2FA: boolean;
  member: LoginMember;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // มิลลิวินาที (900000 = 15 นาที)
  sessionUid: string;
}

export interface LoginSuccessResponse {
  result: true;
  message: string;
  data: LoginData;
  code: number;
}

export interface LoginErrorResponse {
  result: false;
  message: string;
  error?: string;
  errors?: unknown[];
  code: number;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
