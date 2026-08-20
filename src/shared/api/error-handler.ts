import type { AxiosError } from "axios";
import type { ApiErrorResponse, ParsedApiError } from "./types";

/**
 * Parse an Axios error into a structured, consumable format.
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (!isAxiosError(error)) {
    return {
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      statusCode: 0,
      isNetworkError: false,
      isServerError: false,
      isClientError: false,
    };
  }

  // Network error (no response)
  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      statusCode: 0,
      isNetworkError: true,
      isServerError: false,
      isClientError: false,
    };
  }

  const { status, data } = error.response;

  return {
    message: data?.message || getDefaultMessage(status),
    statusCode: status,
    errors: data?.errors,
    isNetworkError: false,
    isServerError: status >= 500,
    isClientError: status >= 400 && status < 500,
  };
}

function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: "Bad request. Please check your input.",
    401: "Session expired. Please login again.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "A conflict occurred. Please try again.",
    422: "Validation failed. Please check your input.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
  };
  return messages[status] || "An unexpected error occurred.";
}

function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (error as AxiosError)?.isAxiosError === true;
}
