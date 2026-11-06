// core/utils/error-message.ts

import { errorResponse } from '../models/index.model';

export function getErrorMessage(
  err: Partial<errorResponse> | null | undefined,
  fallback: string,
): string {
  if (!err) return fallback;

  const detail = err.error;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (detail && typeof detail === 'object' && detail.message?.trim()) return detail.message;

  return err.message?.trim() || fallback;
}
