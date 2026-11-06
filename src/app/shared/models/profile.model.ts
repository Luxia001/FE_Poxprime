import { errorResponse, successResponse } from '../../core/models/index.model';

export interface ProfileImageData {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface ProfileImageSuccessResponse extends successResponse {
  data: ProfileImageData;
}

export type ProfileImageResponse = ProfileImageSuccessResponse | errorResponse;
