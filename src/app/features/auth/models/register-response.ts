import { errorResponse, successResponse } from '../../../core/models/index.model';

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

export interface RegisterSuccessResponse extends successResponse {
  data: RegisteredMember;
}

export type RegisterResponse = RegisterSuccessResponse | errorResponse;
