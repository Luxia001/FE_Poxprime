export interface VerificationMember {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string | null;
  dateOfBirth: string | null;
  isKYC: boolean;
  referralCode: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailVerificationData {
  member: VerificationMember;
  accessToken: string;
  refreshToken: string;
  sessionUid: string;
}

export interface EmailVerificationSuccessResponse {
  result: true;
  message: string;
  data: EmailVerificationData;
  code: number;
}

export interface EmailVerificationErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type EmailVerificationResponse =
  EmailVerificationSuccessResponse | EmailVerificationErrorResponse;
