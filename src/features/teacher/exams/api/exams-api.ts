import { axiosInstance, parseApiError } from "@/shared/api";
import type { PaginatedResponse } from "@/shared/api";

import type {
  Exam,
  ExamsQueryParams,
  ToggleExamStatusPayload,
  ExamBuilderFormData,
} from "../types";

const BASE = "/instructor/tests";

// ─── Normalize raw API → Exam ───
function normalizeExam(raw: any): Exam {
  return {
    id:              String(raw.id),
    title:           raw.title    ?? raw.title_en ?? "",
    title_en:        raw.title_en ?? raw.title    ?? "",
    title_ar:        raw.title_ar ?? raw.title    ?? "",
    courseId:        String(raw.course_id ?? raw.courseId ?? ""),
    courseName:      raw.course_title ?? raw.courseName ?? "",
    questionsCount:  Number(raw.questions_count ?? raw.questionsCount ?? raw.questions?.length ?? 0),
    totalGrade:      Number(raw.full_mark   ?? raw.totalGrade ?? 0),
    durationMins:    Number(raw.duration    ?? raw.durationMins ?? 0),
    attemptsAllowed: Number(raw.max_attempts ?? raw.attemptsAllowed ?? 1),
    passingGrade:    raw.passing_grade != null ? Number(raw.passing_grade) : (raw.passingGrade ?? null),
    status:          raw.status ?? "draft",
    questions:       Array.isArray(raw.questions) ? raw.questions : [],
    settings:        raw.settings ?? {
      questionOrder:     "fixed",
      shuffleAnswers:    false,
      timeBehavior:      "start_on_attempt",
      availabilityStart: null,
      availabilityEnd:   null,
      attemptsLogic:     "highest",
      resultVisibility:  "immediately",
      essayHandling:     "wait_manual",
    },
    createdAt: raw.created_at ?? "",
    updatedAt: raw.updated_at ?? "",
  };
}

// ─── Build FormData for create / update ───
function examToForm(payload: ExamBuilderFormData): FormData {
  const fd = new FormData();

  // title: single field in form → send as both en & ar
  const titleEn = (payload as any).title_en ?? payload.title ?? "";
  const titleAr = (payload as any).title_ar ?? payload.title ?? "";
  fd.append("title_en", titleEn);
  fd.append("title_ar", titleAr);

  // full_mark: sum of question points, fallback to stored totalGrade
  const mark = payload.questions?.length
    ? payload.questions.reduce((sum, q) => sum + Number(q.points || 0), 0)
    : Number((payload as any).totalGrade ?? 0);
  fd.append("full_mark",    String(mark));

  fd.append("duration",     String(payload.durationMins));
  fd.append("max_attempts", String(payload.attemptsAllowed));
  fd.append("status",       payload.status ?? "draft");

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
        search:   params.search  || undefined,
        course:   params.course  || undefined,
        status:   params.status  || undefined,
      },
    });

    return {
      ...data,
      data: Array.isArray(data?.data) ? data.data.map(normalizeExam) : [],
    };
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Fetch Single Exam for Edit ───
// The backend has no GET /instructor/tests/:id route.
// We fetch the full list and find the matching exam by id.
export async function fetchExamDetails(id: string): Promise<Exam> {
  try {
    const { data } = await axiosInstance.get(BASE);
    const list: any[] = Array.isArray(data?.data) ? data.data : [];
    const raw = list.find((e: any) => String(e.id) === String(id));
    if (!raw) throw new Error(`Exam ${id} not found`);
    return normalizeExam(raw);
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
export async function toggleExamStatus(payload: ToggleExamStatusPayload): Promise<Exam> {
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

// ─── Exam Results (all student submissions) ───
export async function fetchExamResults(id: string): Promise<any[]> {
  try {
    const { data } = await axiosInstance.get(`/tests/${id}/get-student-test-results`);
    return data?.data ?? [];
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Edit Question Option ───
// POST /courses/:courseId/lectures/:lectureId/tests/:testId/test-questions/:questionId/question-options/:optionId/edit-question-option
export async function editQuestionOption(params: {
  courseId:   string | number;
  lectureId:  string | number;
  testId:     string | number;
  questionId: string | number;
  optionId:   string | number;
  text_en:    string;
  text_ar?:   string;
}): Promise<any> {
  try {
    const fd = new FormData();
    fd.append("text_en", params.text_en);
    if (params.text_ar) fd.append("text_ar", params.text_ar);
    const { data } = await axiosInstance.post(
      `/courses/${params.courseId}/lectures/${params.lectureId}/tests/${params.testId}/test-questions/${params.questionId}/question-options/${params.optionId}/edit-question-option`,
      fd
    );
    return data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Delete Question Option ───
// DELETE /courses/:courseId/lectures/:lectureId/tests/:testId/test-questions/:questionId/question-options/:optionId/delete-question-option
export async function deleteQuestionOption(params: {
  courseId:   string | number;
  lectureId:  string | number;
  testId:     string | number;
  questionId: string | number;
  optionId:   string | number;
}): Promise<void> {
  try {
    await axiosInstance.delete(
      `/courses/${params.courseId}/lectures/${params.lectureId}/tests/${params.testId}/test-questions/${params.questionId}/question-options/${params.optionId}/delete-question-option`
    );
  } catch (err) {
    throw parseApiError(err);
  }
}
