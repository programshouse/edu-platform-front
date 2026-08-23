/**
 * Courses API layer.
 *
 * When VITE_USE_MOCK=true the mock service is used — no real HTTP requests
 * are ever made. Flip the flag in .env.local to connect the real backend.
 *
 * Expected API contract (REST):
 *   GET    /teacher/courses?page&pageSize&search&status&priceMin&priceMax&dateFrom&dateTo
 *   GET    /teacher/courses/:id
 *   POST   /teacher/courses          (multipart/form-data)
 *   PUT    /teacher/courses/:id      (multipart/form-data)
 *   DELETE /teacher/courses/:id
 *   PATCH  /teacher/courses/:id/status  { status: CourseStatus }
 */

import { axiosInstance, parseApiError } from "@/shared/api";
import type { PaginatedResponse } from "@/shared/api";
import type {
  Course,
  CoursesQueryParams,
  CreateCoursePayload,
  UpdateCoursePayload,
  ToggleCourseStatusPayload,
} from "../types";
import {
  fetchCoursesMock,
  fetchCourseMock,
  createCourseMock,
  updateCourseMock,
  deleteCourseMock,
  toggleCourseStatusMock,
} from "./courses-api.mock";

// ─── Feature flag ───
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ─── Base URL ───
const BASE = "/instructor/courses";

// ────────────────────────────────────────────────────
// Fetch Courses (paginated + filtered)
// ────────────────────────────────────────────────────
export async function fetchCourses(
  params: CoursesQueryParams
): Promise<PaginatedResponse<Course>> {
  if (USE_MOCK) return fetchCoursesMock(params);

  try {
    const { data } = await axiosInstance.get<PaginatedResponse<Course>>(BASE, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search || undefined,
        status: params.status || undefined,
        priceMin: params.priceMin !== "" ? params.priceMin : undefined,
        priceMax: params.priceMax !== "" ? params.priceMax : undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
      },
    });
    return data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ────────────────────────────────────────────────────
// Fetch Single Course
// ────────────────────────────────────────────────────
export async function fetchCourse(id: string): Promise<Course> {
  if (USE_MOCK) return fetchCourseMock(id);

  try {
    const { data } = await axiosInstance.get<{ data: Course }>(`${BASE}/${id}`);
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ────────────────────────────────────────────────────
// Create Course
// ────────────────────────────────────────────────────
export async function createCourse(payload: CreateCoursePayload): Promise<Course> {
  if (USE_MOCK) return createCourseMock(payload);

  try {
    const formData = buildFormData(payload);
    const { data } = await axiosInstance.post<{ data: Course }>("/store-course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ────────────────────────────────────────────────────
// Update Course
// ────────────────────────────────────────────────────
export async function updateCourse({ id, ...payload }: UpdateCoursePayload): Promise<Course> {
  if (USE_MOCK) return updateCourseMock({ id, ...payload } as UpdateCoursePayload);

  try {
    const formData = buildFormData(payload as CreateCoursePayload);
    const { data } = await axiosInstance.post<{ data: Course }>(`/update-course/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ────────────────────────────────────────────────────
// Delete Course
// ────────────────────────────────────────────────────
export async function deleteCourse(id: string): Promise<void> {
  if (USE_MOCK) return deleteCourseMock(id);

  try {
    await axiosInstance.delete(`/courses/${id}/delete-course`);
  } catch (err) {
    throw parseApiError(err);
  }
}

// ────────────────────────────────────────────────────
// Toggle Course Status
// ────────────────────────────────────────────────────
export async function toggleCourseStatus(
  payload: ToggleCourseStatusPayload
): Promise<Course> {
  if (USE_MOCK) return toggleCourseStatusMock(payload);

  try {
    const { data } = await axiosInstance.patch<{ data: Course }>(
      `${BASE}/${payload.id}/status`,
      { status: payload.status }
    );
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ────────────────────────────────────────────────────
// Internal helpers
// ────────────────────────────────────────────────────
function buildFormData(payload: Partial<CreateCoursePayload>): FormData {
  const fd = new FormData();
  if (payload.title !== undefined) fd.append("title", payload.title);
  if (payload.description !== undefined) fd.append("description", payload.description);
  if (payload.price !== undefined) fd.append("price", String(payload.price));
  if (payload.durationDays !== undefined)
    fd.append("durationDays", String(payload.durationDays));
  if (payload.startDate !== undefined) fd.append("startDate", payload.startDate);
  if (payload.endDate !== undefined) fd.append("endDate", payload.endDate);
  if (payload.allowSeparateLectures !== undefined)
    fd.append("allowSeparateLectures", String(payload.allowSeparateLectures));
  if (payload.coverImage instanceof File) fd.append("coverImage", payload.coverImage);
  return fd;
}
