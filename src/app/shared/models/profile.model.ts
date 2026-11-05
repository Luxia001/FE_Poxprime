export interface ProfileImageData {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface ProfileImageSuccessResponse {
  result: true;
  message: string;
  data: ProfileImageData;
  code: number;
}

export interface ProfileImageErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type ProfileImageResponse = ProfileImageSuccessResponse | ProfileImageErrorResponse;
