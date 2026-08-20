import { axiosInstance, parseApiError } from "@/shared/api";
import type { PaginatedResponse } from "@/shared/api";
import type { 
  Exam, 
  ExamsQueryParams, 
  ToggleExamStatusPayload,
  ExamBuilderFormData 
} from "../types";
import {
  fetchExamsMock,
  fetchExamDetailsMock,
  createExamMock,
  updateExamMock,
  deleteExamMock,
  toggleExamStatusMock,
} from "./exams-api.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const BASE = "/teacher/exams";

export async function fetchExams(
  params: ExamsQueryParams
): Promise<PaginatedResponse<Exam>> {
  if (USE_MOCK) return fetchExamsMock(params);

  try {
    const { data } = await axiosInstance.get<PaginatedResponse<Exam>>(BASE, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search || undefined,
        course: params.course || undefined,
        status: params.status || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
      },
    });
    return data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function fetchExamDetails(id: string): Promise<Exam> {
  if (USE_MOCK) return fetchExamDetailsMock(id);

  try {
    const { data } = await axiosInstance.get<{ data: Exam }>(`${BASE}/${id}`);
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function createExam(payload: ExamBuilderFormData): Promise<Exam> {
  if (USE_MOCK) return createExamMock(payload);

  try {
    const { data } = await axiosInstance.post<{ data: Exam }>(BASE, payload);
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function updateExam({ id, payload }: { id: string, payload: ExamBuilderFormData }): Promise<Exam> {
  if (USE_MOCK) return updateExamMock(id, payload);

  try {
    const { data } = await axiosInstance.put<{ data: Exam }>(`${BASE}/${id}`, payload);
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function deleteExam(id: string): Promise<void> {
  if (USE_MOCK) return deleteExamMock(id);

  try {
    await axiosInstance.delete(`${BASE}/${id}`);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function toggleExamStatus(
  payload: ToggleExamStatusPayload
): Promise<Exam> {
  if (USE_MOCK) return toggleExamStatusMock(payload);

  try {
    const { data } = await axiosInstance.patch<{ data: Exam }>(
      `${BASE}/${payload.id}/status`,
      { status: payload.status }
    );
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}
