// /**
//  * Mock API service for courses.
//  *
//  * Mirrors the real courses-api.ts public surface exactly —
//  * swap by flipping VITE_USE_MOCK in .env.
//  *
//  * Features:
//  *  - Simulated network latency (configurable via VITE_MOCK_DELAY_MS)
//  *  - Server-side search, filter, sort, and pagination
//  *  - Optimistic CRUD with in-memory state
//  *  - Realistic error simulation (set VITE_MOCK_FAIL_RATE=0.1 for 10% failures)
//  */

// import { MOCK_COURSES } from "./courses-mock-data";
// import type { Course, CoursesQueryParams, CourseStatus } from "../types";
// import type {
//   CreateCoursePayload,
//   UpdateCoursePayload,
//   ToggleCourseStatusPayload,
// } from "../types";
// import type { PaginatedResponse } from "@/shared/api";

// // ─── In-memory store (survives re-renders, resets on full page reload) ───
// let store: Course[] = [...MOCK_COURSES];
// let idCounter = 100;

// // ─── Config from environment ───
// const DELAY_MS = Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 600);
// const FAIL_RATE = Number(import.meta.env.VITE_MOCK_FAIL_RATE ?? 0);

// // ─── Helpers ───
// function delay(ms = DELAY_MS): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function maybeFail(): void {
//   if (FAIL_RATE > 0 && Math.random() < FAIL_RATE) {
//     throw { message: "Simulated network error (VITE_MOCK_FAIL_RATE)", statusCode: 503 };
//   }
// }

// function matchesSearch(course: Course, search: string): boolean {
//   if (!search.trim()) return true;
//   const q = search.toLowerCase();
//   return (
//     course.title.toLowerCase().includes(q) ||
//     course.description.toLowerCase().includes(q)
//   );
// }

// function matchesStatus(course: Course, status: CourseStatus | ""): boolean {
//   return !status || course.status === status;
// }

// function matchesPrice(
//   course: Course,
//   min: number | "",
//   max: number | ""
// ): boolean {
//   if (min !== "" && course.price < min) return false;
//   if (max !== "" && course.price > max) return false;
//   return true;
// }

// function matchesDate(
//   course: Course,
//   from: string,
//   to: string
// ): boolean {
//   if (from && course.createdAt < from) return false;
//   if (to && course.createdAt > to + "T23:59:59Z") return false;
//   return true;
// }

// // ─── Public API (matches real courses-api.ts signatures exactly) ───

// export async function fetchCoursesMock(
//   params: CoursesQueryParams
// ): Promise<PaginatedResponse<Course>> {
//   await delay();
//   maybeFail();

//   const {
//     search = "",
//     status = "",
//     priceMin = "",
//     priceMax = "",
//     dateFrom = "",
//     dateTo = "",
//     page = 1,
//     pageSize = 8,
//   } = params;

//   // Filter
//   const filtered = store.filter(
//     (c) =>
//       matchesSearch(c, search) &&
//       matchesStatus(c, status as CourseStatus | "") &&
//       matchesPrice(c, priceMin, priceMax) &&
//       matchesDate(c, dateFrom, dateTo)
//   );

//   // Sort (newest first)
//   const sorted = [...filtered].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   );

//   // Paginate
//   const total = sorted.length;
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   const safePage = Math.min(Math.max(1, page), totalPages);
//   const offset = (safePage - 1) * pageSize;
//   const data = sorted.slice(offset, offset + pageSize);

//   return {
//     data,
//     meta: { total, page: safePage, pageSize, totalPages },
//   };
// }

// export async function fetchCourseMock(id: string): Promise<Course> {
//   await delay(300);
//   maybeFail();
//   const course = store.find((c) => c.id === id);
//   if (!course) throw { message: `Course ${id} not found`, statusCode: 404 };
//   return course;
// }

// export async function createCourseMock(
//   payload: CreateCoursePayload
// ): Promise<Course> {
//   await delay();
//   maybeFail();

//   const newCourse: Course = {
//     id: `c${String(++idCounter).padStart(3, "0")}`,
//     title: payload.title,
//     description: payload.description,
//     coverImage: payload.coverImage
//       ? URL.createObjectURL(payload.coverImage)
//       : null,
//     price: payload.price,
//     durationDays: payload.durationDays,
//     startDate: payload.startDate,
//     endDate: payload.endDate,
//     allowSeparateLectures: payload.allowSeparateLectures,
//     lecturesCount: 0,
//     enrolledStudentsCount: 0,
//     status: "inactive",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   store = [newCourse, ...store];
//   return newCourse;
// }

// export async function updateCourseMock({
//   id,
//   ...payload
// }: UpdateCoursePayload): Promise<Course> {
//   await delay();
//   maybeFail();

//   const idx = store.findIndex((c) => c.id === id);
//   if (idx === -1) throw { message: `Course ${id} not found`, statusCode: 404 };

//   const updated: Course = {
//     ...store[idx],
//     ...(payload.title !== undefined && { title: payload.title }),
//     ...(payload.description !== undefined && { description: payload.description }),
//     ...(payload.price !== undefined && { price: payload.price }),
//     ...(payload.durationDays !== undefined && { durationDays: payload.durationDays }),
//     ...(payload.startDate !== undefined && { startDate: payload.startDate }),
//     ...(payload.endDate !== undefined && { endDate: payload.endDate }),
//     ...(payload.allowSeparateLectures !== undefined && {
//       allowSeparateLectures: payload.allowSeparateLectures,
//     }),
//     ...(payload.coverImage instanceof File && {
//       coverImage: URL.createObjectURL(payload.coverImage),
//     }),
//     updatedAt: new Date().toISOString(),
//   };

//   store = store.map((c, i) => (i === idx ? updated : c));
//   return updated;
// }

// export async function deleteCourseMock(id: string): Promise<void> {
//   await delay();
//   maybeFail();
//   const exists = store.some((c) => c.id === id);
//   if (!exists) throw { message: `Course ${id} not found`, statusCode: 404 };
//   store = store.filter((c) => c.id !== id);
// }

// export async function toggleCourseStatusMock(
//   payload: ToggleCourseStatusPayload
// ): Promise<Course> {
//   await delay(350);
//   maybeFail();

//   const idx = store.findIndex((c) => c.id === payload.id);
//   if (idx === -1)
//     throw { message: `Course ${payload.id} not found`, statusCode: 404 };

//   const updated: Course = {
//     ...store[idx],
//     status: payload.status,
//     updatedAt: new Date().toISOString(),
//   };
//   store = store.map((c, i) => (i === idx ? updated : c));
//   return updated;
// }
