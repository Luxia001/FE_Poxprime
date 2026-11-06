export interface successResponse {
  result: true;
  message: string;
  code: number;
}

export interface errorResponse {
  result: false;
  message: string;
  code: number;
  error?: string | { code?: string; message?: string };
  errors?: unknown[];
}
