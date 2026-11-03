export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneCode: string;
  phoneNumber: string;
  country: string;
  referralCode: string;
  saleCode: string;
  terms: 'true';
}
