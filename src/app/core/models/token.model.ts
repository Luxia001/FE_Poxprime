import { errorResponse, successResponse } from './index.model';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  sessionUid?: string;
}

export interface RefreshTokenSuccessResponse extends successResponse {
  data: RefreshTokenData;
}

export type RefreshTokenResponse = RefreshTokenSuccessResponse | errorResponse;
