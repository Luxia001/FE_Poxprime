import { errorResponse, successResponse } from '../../core/models/index.model';

export interface ActiveSession {
  session_uid: string;
  session_agent: string;
  session_browser: string;
  session_os: string;
  session_city: string | null;
  session_country: string | null;
  session_ip: string;
  session_time: number; // Unix timestamp หน่วย "วินาที" (เวลาเข้าสู่ระบบ)
  session_expire: number; // วินาที
  session_latest: number; // วินาที (ใช้งานล่าสุด)
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ActiveSessionsSuccessResponse extends successResponse {
  data: ActiveSession[];
  pagination: Pagination;
}

export type ActiveSessionsResponse = ActiveSessionsSuccessResponse | errorResponse;
