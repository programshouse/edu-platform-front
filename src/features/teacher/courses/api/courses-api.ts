/**
 * Instructor Courses API layer.
 *
 * Real backend only - no mock/static data.
 *
 * API:
 * GET    /instructor/courses
 * GET    /courses/:id
 * POST   /store-course
 * POST   /courses/:id/edit-course
 * DELETE /courses/:id/delete-course
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

const BASE = "/instructor/courses";


// ─────────────────────────────────────────────
// Fetch Instructor Courses
// ─────────────────────────────────────────────

export async function fetchCourses(
  params: CoursesQueryParams = {}
): Promise<PaginatedResponse<Course>> {
  try {
    const { data } = await axiosInstance.get<any>(BASE, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search || undefined,
        status: params.status || undefined,
        priceMin:
          params.priceMin !== ""
            ? params.priceMin
            : undefined,
        priceMax:
          params.priceMax !== ""
            ? params.priceMax
            : undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
      },
    });


    // API response:
    // {
    //   message:"success",
    //   data:[]
    // }

    if (Array.isArray(data?.data)) {
      return {
        data: data.data,
        meta: {
          page: 1,
          pageSize: data.data.length,
          total: data.data.length,
          totalPages: 1,
        },
      };
    }


    return data;

  } catch (err) {
    throw parseApiError(err);
  }
}


// ─────────────────────────────────────────────
// Get Single Course
// ─────────────────────────────────────────────

export async function fetchCourse(
  id: string
): Promise<Course> {

  try {

    const { data } =
      await axiosInstance.get<{ data: Course }>(
        `/courses/${id}`
      );

    return data.data;

  } catch (err) {
    throw parseApiError(err);
  }
}



// ─────────────────────────────────────────────
// Create Course
// ─────────────────────────────────────────────

export async function createCourse(
  payload: CreateCoursePayload
): Promise<Course> {

  try {

    const formData = buildFormData(payload);

    const { data } =
      await axiosInstance.post<{ data: Course }>(
        "/store-course",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


    return data.data;

  } catch (err) {
    throw parseApiError(err);
  }
}



// ─────────────────────────────────────────────
// Update Course
// ─────────────────────────────────────────────

export async function updateCourse(
  payload: UpdateCoursePayload
): Promise<Course> {

  try {

    const {
      id,
      ...courseData
    } = payload;


    const formData =
      buildFormData(
        courseData as CreateCoursePayload
      );


    const { data } =
      await axiosInstance.post<{ data: Course }>(
        `/courses/${id}/edit-course`,
        formData,
        {
          headers:{
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


    return data.data;


  } catch (err) {

    throw parseApiError(err);

  }
}



// ─────────────────────────────────────────────
// Delete Course
// ─────────────────────────────────────────────

export async function deleteCourse(
  id:string
): Promise<void> {

  try {

    await axiosInstance.delete(
      `/courses/${id}/delete-course`
    );


  } catch(err){

    throw parseApiError(err);

  }
}



// ─────────────────────────────────────────────
// Toggle Course Status
// ─────────────────────────────────────────────

export async function toggleCourseStatus(
  payload: ToggleCourseStatusPayload
): Promise<Course>{

  try {

    const {data} =
      await axiosInstance.patch<{data:Course}>(
        `${BASE}/${payload.id}/status`,
        {
          status: payload.status
        }
      );


    return data.data;


  } catch(err){

    throw parseApiError(err);

  }

}



// ─────────────────────────────────────────────
// Build Multipart FormData
// ─────────────────────────────────────────────

function buildFormData(
  payload: Partial<CreateCoursePayload>
):FormData {

  const fd = new FormData();


  if(payload.title !== undefined)
    fd.append(
      "title",
      payload.title
    );


  if(payload.description !== undefined)
    fd.append(
      "description",
      payload.description
    );

  if(payload.categoryId !== undefined)
    fd.append(
      "category_id",
      String(payload.categoryId)
    );


  if(payload.price !== undefined)
    fd.append(
      "price",
      String(payload.price)
    );


  if(payload.durationDays !== undefined)
    fd.append(
      "durationDays",
      String(payload.durationDays)
    );


  if(payload.startDate !== undefined)
    fd.append(
      "start_date",
      payload.startDate
    );


  if(payload.endDate !== undefined)
    fd.append(
      "end_date",
      payload.endDate
    );


  if(payload.allowSeparateLectures !== undefined)
    fd.append(
      "lectures_can_be_purchased_separately",
      String(
        payload.allowSeparateLectures
      )
    );


  if(payload.coverImage instanceof File)
    fd.append(
      "image",
      payload.coverImage
    );


  return fd;
}