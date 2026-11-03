export interface UserProfile {
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

export interface ProfileResponse {
  result: boolean;
  message: string;
  data: UserProfile;
  code: number;
}
