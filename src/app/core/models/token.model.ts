export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  sessionUid?: string;
}

export interface RefreshTokenSuccessResponse {
  result: true;
  message: string;
  data: RefreshTokenData;
  code: number;
}

export interface RefreshTokenErrorResponse {
  result: false;
  message: string;
  code: number;
}

export type RefreshTokenResponse = RefreshTokenSuccessResponse | RefreshTokenErrorResponse;
