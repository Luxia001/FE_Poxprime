export interface RegisteredMember {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  dateOfBirth: string;
  isKYC: boolean;
  referralCode: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterSuccessResponse {
  result: true;
  message: string;
  data: RegisteredMember;
  code: number;
}

export interface RegisterApiErrorDetail {
  code: string;
  message: string;
}

export interface RegisterErrorResponse {
  result: false;
  message: string;
  error?: RegisterApiErrorDetail;
  errors?: string[];
  code?: number;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
