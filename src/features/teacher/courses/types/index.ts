// ─── Course Status ───
export type CourseStatus = "active" | "inactive" | "finished";

// ─── Course Level ───
export type CourseLevel = "beginner" | "intermediate" | "advanced";

// ─── Core Course Entity ───
export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  categoryId?: number;
  category?: { id:number; name:string };
  price: number;
  level: CourseLevel;
  accessDurationDays: number;
  totalDurationMinutes: number;
  startDate: string;
  endDate: string;
  lecturesCount: number;
  enrolledStudentsCount: number;
  status: CourseStatus;
  allowSeparateLectures: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Filters & Pagination ───
export interface CoursesFilters {
  search: string;
  status: CourseStatus | "";
  priceMin: number | "";
  priceMax: number | "";
  dateFrom: string;
  dateTo: string;
}

export interface CoursesPagination {
  page: number;
  pageSize: number;
}

export type CoursesQueryParams = CoursesFilters & CoursesPagination;

// ─── Form Schemas (used with Zod + React Hook Form) ───
export interface CreateCourseFormData {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  coverImage?: File | null;
  price: number;
  level: CourseLevel;
  accessDurationDays: number;
  totalDurationMinutes: number;
  startDate: string;
  endDate?: string;
  allowSeparateLectures: boolean;
}

export type UpdateCourseFormData = Partial<CreateCourseFormData>;

// ─── API Payloads ───
export interface CreateCoursePayload {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: number;
  coverImage?: File;
  price: number;
  level: CourseLevel;
  accessDurationDays: number;
  totalDurationMinutes: number;
  startDate: string;
  endDate?: string;
  allowSeparateLectures: boolean;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  id: string;
}

export interface ToggleCourseStatusPayload {
  id: string;
  status: CourseStatus;
}

// ─── UI State ───
export interface CourseUIState {
  selectedCourseId: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingCourse: Course | null;
  deletingCourse: Course | null;
}
