import { errorResponse, successResponse } from '../../core/models/index.model';

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

export interface EmailVerificationSuccessResponse extends successResponse {
  data: EmailVerificationData;
}

export type EmailVerificationResponse = EmailVerificationSuccessResponse | errorResponse;
