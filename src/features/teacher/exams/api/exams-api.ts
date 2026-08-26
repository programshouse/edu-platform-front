import { axiosInstance, parseApiError } from "@/shared/api";
import type { PaginatedResponse } from "@/shared/api";

import type {
  Exam,
  ExamsQueryParams,
  ToggleExamStatusPayload,
  ExamBuilderFormData,
} from "../types";

const BASE = "/instructor/tests";

// ─── Normalize raw API exam → Exam ───
function normalizeExam(raw: any): Exam {
  return {
    id:              String(raw.id),
    title:           raw.title ?? raw.title_en ?? "",
    courseId:        String(raw.course_id ?? raw.courseId ?? ""),
    courseName:      raw.course_title ?? raw.courseName ?? undefined,
    questionsCount:  Number(raw.tests_count ?? raw.questions_count ?? raw.questionsCount ?? 0),
    totalGrade:      Number(raw.full_mark ?? raw.totalGrade ?? 0),
    durationMins:    Number(raw.duration ?? raw.durationMins ?? 0),
    attemptsAllowed: Number(raw.max_attempts ?? raw.attemptsAllowed ?? 1),
    passingGrade:    raw.passing_grade != null ? Number(raw.passing_grade) : (raw.passingGrade ?? null),
    status:          raw.status ?? "draft",
    questions:       Array.isArray(raw.questions) ? raw.questions : [],
    settings:        raw.settings ?? {
      questionOrder:      "fixed",
      shuffleAnswers:     false,
      timeBehavior:       "start_on_attempt",
      availabilityStart:  null,
      availabilityEnd:    null,
      attemptsLogic:      "highest",
      resultVisibility:   "immediately",
      essayHandling:      "wait_manual",
    },
    createdAt: raw.created_at ?? raw.createdAt ?? "",
    updatedAt: raw.updated_at ?? raw.updatedAt ?? "",
  };
}

// ─── Build FormData ───
function examToForm(payload: ExamBuilderFormData): FormData {
  const fd = new FormData();
  fd.append("title_en", (payload as any).title_en ?? payload.title ?? "");
  fd.append("title_ar", (payload as any).title_ar ?? payload.title ?? "");
  fd.append("full_mark", String(
    payload.questions.reduce((sum, q) => sum + Number(q.points || 0), 0)
  ));
  fd.append("duration",     String(payload.durationMins));
  fd.append("max_attempts", String(payload.attemptsAllowed));
  fd.append("status",       payload.status);
  return fd;
}

// ─── Fetch Exams List ───
export async function fetchExams(
  params: ExamsQueryParams
): Promise<PaginatedResponse<Exam>> {
  try {
    const { data } = await axiosInstance.get(BASE, {
      params: {
        page:     params.page,
        pageSize: params.pageSize,
        search:   params.search   || undefined,
        course:   params.course   || undefined,
        status:   params.status   || undefined,
      },
    });

    if (Array.isArray(data?.data)) {
      return {
        data: data.data.map(normalizeExam),
        meta: {
          page:       1,
          pageSize:   data.data.length,
          total:      data.data.length,
          totalPages: 1,
        },
      };
    }

    return {
      ...data,
      data: Array.isArray(data?.data) ? data.data.map(normalizeExam) : [],
    };
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Fetch Single Exam (for edit) ───
export async function fetchExamDetails(id: string): Promise<Exam> {
  try {
    // Try instructor-scoped endpoint first, fallback shape is same
    const { data } = await axiosInstance.get(`/tests/${id}`);
    return normalizeExam(data?.data ?? data);
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Create Exam ───
export async function createExam(payload: ExamBuilderFormData): Promise<Exam> {
  try {
    const { data } = await axiosInstance.post(
      `/courses/${payload.courseId}/store-test`,
      examToForm(payload),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return normalizeExam(data?.data ?? data);
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Update Exam ───
export async function updateExam({
  id,
  payload,
}: {
  id: string;
  payload: ExamBuilderFormData;
}): Promise<Exam> {
  try {
    const { data } = await axiosInstance.post(
      `/tests/${id}/edit-test`,
      examToForm(payload),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return normalizeExam(data?.data ?? data);
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Delete Exam ───
export async function deleteExam(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`/tests/${id}/delete-test`);
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Toggle Status ───
export async function toggleExamStatus(
  payload: ToggleExamStatusPayload
): Promise<Exam> {
  try {
    const fd = new FormData();
    fd.append("status", payload.status);
    const { data } = await axiosInstance.post(
      `/tests/${payload.id}/edit-test`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return normalizeExam(data?.data ?? data);
  } catch (err) {
    throw parseApiError(err);
  }
}
