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

export interface ActiveSessionsSuccessResponse {
  result: true;
  message: string;
  data: ActiveSession[];
  pagination: Pagination;
  code: number;
}

export interface ActiveSessionsErrorResponse {
  result: false;
  message: string;
  error?: string;
  code: number;
}

export type ActiveSessionsResponse = ActiveSessionsSuccessResponse | ActiveSessionsErrorResponse;
