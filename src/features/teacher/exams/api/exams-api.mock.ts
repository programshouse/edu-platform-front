import { sleep } from "@/shared/lib/utils";
import type { PaginatedResponse } from "@/shared/api";
import type { 
  Exam, 
  ExamsQueryParams, 
  ToggleExamStatusPayload,
  ExamBuilderFormData
} from "../types";
import { mockExams } from "./exams-mock-data";

let examsStore = [...mockExams];

export async function fetchExamsMock(
  params: ExamsQueryParams
): Promise<PaginatedResponse<Exam>> {
  await sleep(600);

  let filtered = [...examsStore];

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((ex) => ex.title.toLowerCase().includes(q));
  }

  // Course filter
  if (params.course) {
    filtered = filtered.filter((ex) => ex.courseId === params.course);
  }

  // Status filter
  if (params.status) {
    filtered = filtered.filter((ex) => ex.status === params.status);
  }

  // Date range filters
  if (params.dateFrom) {
    const from = new Date(params.dateFrom).getTime();
    filtered = filtered.filter((ex) => new Date(ex.createdAt).getTime() >= from);
  }
  if (params.dateTo) {
    // Add 1 day to include the end date fully
    const to = new Date(params.dateTo).getTime() + 86400000;
    filtered = filtered.filter((ex) => new Date(ex.createdAt).getTime() <= to);
  }

  // Sort by createdAt desc
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages,
    },
  };
}

export async function fetchExamDetailsMock(id: string): Promise<Exam> {
  await sleep(500);
  const exam = examsStore.find(e => e.id === id);
  if (!exam) throw new Error("Exam not found");
  return exam;
}

export async function createExamMock(payload: ExamBuilderFormData): Promise<Exam> {
  await sleep(800);
  const totalGrade = payload.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  
  const newExam: Exam = {
    id: `exam-${Date.now()}`,
    ...payload,
    passingGrade: payload.passingGrade ?? null,
    courseName: "Selected Course", // In reality, fetched from DB
    questionsCount: payload.questions.length,
    totalGrade,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  examsStore.unshift(newExam);
  return newExam;
}

export async function updateExamMock(id: string, payload: ExamBuilderFormData): Promise<Exam> {
  await sleep(800);
  const idx = examsStore.findIndex(e => e.id === id);
  if (idx === -1) throw new Error("Exam not found");

  const totalGrade = payload.questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const updatedExam: Exam = {
    ...examsStore[idx],
    ...payload,
    passingGrade: payload.passingGrade ?? null,
    questionsCount: payload.questions.length,
    totalGrade,
    updatedAt: new Date().toISOString(),
  };

  examsStore[idx] = updatedExam;
  return updatedExam;
}

export async function deleteExamMock(id: string): Promise<void> {
  await sleep(600);
  const exists = examsStore.find((ex) => ex.id === id);
  if (!exists) throw new Error("Exam not found");
  examsStore = examsStore.filter((ex) => ex.id !== id);
}

export async function toggleExamStatusMock(
  payload: ToggleExamStatusPayload
): Promise<Exam> {
  await sleep(600);
  const idx = examsStore.findIndex((ex) => ex.id === payload.id);
  if (idx === -1) throw new Error("Exam not found");

  const updated = {
    ...examsStore[idx],
    status: payload.status,
    updatedAt: new Date().toISOString(),
  };
  examsStore[idx] = updated;
  return updated;
}
