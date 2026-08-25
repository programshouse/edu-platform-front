
import { axiosInstance, parseApiError } from "@/shared/api";
import type { PaginatedResponse } from "@/shared/api";
import type { 
  Exam, 
  ExamsQueryParams, 
  ToggleExamStatusPayload,
  ExamBuilderFormData,
  Question,
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
const BASE = "/instructor/tests";

const getLang = () =>
  localStorage.getItem("i18nextLng")?.startsWith("ar") ? "ar" : "en";

/**
 * Backend endpoints:
 * GET    /instructor/tests
 * POST   /courses/{courseId}/store-test
 * POST   /courses/{courseId}/lectures/{lectureId}/tests/{testId}/store-question
 * POST   /courses/{courseId}/lectures/{lectureId}/tests/{testId}/edit-question
 * DELETE /courses/{courseId}/lectures/{lectureId}/tests/{testId}/delete-question
 * POST   /courses/{testId}/edit-test
 * DELETE /courses/{testId}/delete-test
 */

export async function fetchExams(params: ExamsQueryParams): Promise<PaginatedResponse<Exam>> {
  if (USE_MOCK) return fetchExamsMock(params);

  try {
    const { data } = await axiosInstance.get(BASE, {
      headers: { lang: getLang() },
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search || undefined,
        course: params.course || undefined,
        status: params.status || undefined,
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
    const { data } = await axiosInstance.get(`${BASE}/${id}`, {
      headers: { lang: getLang() },
    });
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

function examToForm(payload: ExamBuilderFormData) {
  const form = new FormData();

  form.append("title", payload.title);
  form.append("full_mark", String(
    payload.questions.reduce((a, q) => a + Number(q.points || 0), 0)
  ));
  form.append("duration", String(payload.durationMins));
  form.append("max_attempts", String(payload.attemptsAllowed));
  form.append("status", payload.status);

  return form;
}

export async function createExam(payload: ExamBuilderFormData): Promise<Exam> {
  if (USE_MOCK) return createExamMock(payload);

  try {
    const { data } = await axiosInstance.post(
      `/courses/${payload.courseId}/store-test`,
      examToForm(payload),
      {
        headers: {
          "Content-Type": "multipart/form-data",
          lang: getLang(),
        },
      }
    );

    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function updateExam({
  id,
  payload,
}: {
  id: string;
  payload: ExamBuilderFormData;
}): Promise<Exam> {
  if (USE_MOCK) return updateExamMock(id, payload);

  try {
    const { data } = await axiosInstance.post(
      `/courses/${id}/edit-test`,
      examToForm(payload),
      {
        headers: {
          "Content-Type": "multipart/form-data",
          lang: getLang(),
        },
      }
    );

    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function deleteExam(id: string): Promise<void> {
  if (USE_MOCK) return deleteExamMock(id);

  try {
    await axiosInstance.delete(`/courses/${id}/delete-test`, {
      headers: { lang: getLang() },
    });
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function toggleExamStatus(payload: ToggleExamStatusPayload): Promise<Exam> {
  if (USE_MOCK) return toggleExamStatusMock(payload);

  try {
    const { data } = await axiosInstance.post(
      `/courses/${payload.id}/edit-test`,
      { status: payload.status },
      { headers: { lang: getLang() } }
    );
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// Questions APIs

export async function addTestQuestion(args: {
  courseId: string;
  lectureId: string;
  testId: string;
  question: Question;
}) {
  const { courseId, lectureId, testId, question } = args;

  const body = new FormData();
  body.append("question_en", question.text);
  body.append("question_ar", question.text);
  body.append("type", question.type);
  body.append("mark", String(question.points));

  return axiosInstance.post(
    `/courses/${courseId}/lectures/${lectureId}/tests/${testId}/store-question`,
    body,
    { headers: { "Content-Type": "multipart/form-data", lang: getLang() } }
  );
}

export async function editTestQuestion(args: {
  courseId: string;
  lectureId: string;
  testId: string;
  questionId: string;
  question: Question;
}) {
  const { courseId, lectureId, testId, questionId, question } = args;

  const body = new FormData();
  body.append("question_en", question.text);
  body.append("question_ar", question.text);
  body.append("type", question.type);
  body.append("mark", String(question.points));

  return axiosInstance.post(
    `/courses/${courseId}/lectures/${lectureId}/tests/${testId}/questions/${questionId}/edit-question`,
    body,
    { headers: { "Content-Type": "multipart/form-data", lang: getLang() } }
  );
}

export async function deleteTestQuestion(args: {
  courseId: string;
  lectureId: string;
  testId: string;
  questionId: string;
}) {
  return axiosInstance.delete(
    `/courses/${args.courseId}/lectures/${args.lectureId}/tests/${args.testId}/questions/${args.questionId}/delete-question`,
    { headers: { lang: getLang() } }
  );
}
