/**
 * Instructor Lectures API
 *
 * POST   /courses/:courseId/store-lecture
 * POST   /courses/:lectureId/update-lecture
 * DELETE /courses/:lectureId/delete-lecture
 * GET    /instructor/lectures  (all instructor lectures)
 */

import { axiosInstance, parseApiError } from "@/shared/api";

export interface LecturePayload {
  titleEn: string;
  titleAr: string;
  lectureType: "recorded" | "live";
  video?: File | null;
  durationMinutes: number;
  isFree: 0 | 1;
}

export interface LectureItem {
  id: number;
  course_id: number;
  course_title?: string;
  title: string;
  title_en?: string;
  title_ar?: string;
  lecture_type: "recorded" | "live";
  video_url?: string | null;
  duration_minutes: number;
  is_free: boolean;
  homeworks_count?: number;
  tests_count?: number;
}

// ─── Fetch lectures for a course ───
export async function fetchCourseLectures(courseId: string): Promise<LectureItem[]> {
  try {
    const { data } = await axiosInstance.get(`/instructor/lectures`, {
      params: { course_id: courseId },
    });
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Add lecture to course ───
export async function createLecture(courseId: string, payload: LecturePayload): Promise<LectureItem> {
  try {
    const fd = buildLectureFormData(payload);
    const { data } = await axiosInstance.post(`/courses/${courseId}/store-lecture`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Update lecture ───
export async function updateLecture(lectureId: string | number, payload: Partial<LecturePayload>): Promise<LectureItem> {
  try {
    const fd = buildLectureFormData(payload as LecturePayload);
    const { data } = await axiosInstance.post(`/courses/${lectureId}/update-lecture`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Delete lecture ───
export async function deleteLecture(lectureId: string | number): Promise<void> {
  try {
    await axiosInstance.delete(`/courses/${lectureId}/delete-lecture`);
  } catch (err) {
    throw parseApiError(err);
  }
}

// ─── Build FormData ───
function buildLectureFormData(payload: Partial<LecturePayload>): FormData {
  const fd = new FormData();
  if (payload.titleEn !== undefined)       fd.append("title_en", payload.titleEn);
  if (payload.titleAr !== undefined)       fd.append("title_ar", payload.titleAr);
  if (payload.lectureType !== undefined)   fd.append("lecture_type", payload.lectureType);
  if (payload.durationMinutes !== undefined) fd.append("duration_minutes", String(payload.durationMinutes));
  if (payload.isFree !== undefined)        fd.append("is_free", String(payload.isFree));
  if (payload.video instanceof File)       fd.append("video", payload.video);
  return fd;
}
