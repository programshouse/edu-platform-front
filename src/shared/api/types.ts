import type { AxiosError } from "axios";

// ─── API Response Types ───

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ─── Error Handling Types ───

export type ApiError = AxiosError<ApiErrorResponse>;

export interface ParsedApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  isNetworkError: boolean;
  isServerError: boolean;
  isClientError: boolean;
}
