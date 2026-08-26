import { create } from "zustand";
import type { Course, CourseStatus } from "../types";

interface CourseOverviewState {
  course: Course | null;
  isLoading: boolean;
  isEditModalOpen: boolean;
  isConfirmDialogOpen: boolean;

  // Actions
  setCourse: (course: Course) => void;
  setLoading: (v: boolean) => void;

  // Modal toggles
  openEditModal: () => void;
  closeEditModal: () => void;

  // Confirm Dialog toggles
  openConfirmDialog: () => void;
  closeConfirmDialog: () => void;

  // Optimistic local updates
  updateCourseLocally: (data: Partial<Course>) => void;
  toggleStatusLocally: (status: CourseStatus) => void;
}

export const useCourseOverviewStore = create<CourseOverviewState>((set) => ({
  course: null,
  isLoading: true,
  isEditModalOpen: false,
  isConfirmDialogOpen: false,

  setCourse: (course) => set({ course, isLoading: false }),
  setLoading: (v) => set({ isLoading: v }),

  openEditModal:    () => set({ isEditModalOpen: true }),
  closeEditModal:   () => set({ isEditModalOpen: false }),
  openConfirmDialog:  () => set({ isConfirmDialogOpen: true }),
  closeConfirmDialog: () => set({ isConfirmDialogOpen: false }),

  updateCourseLocally: (data) =>
    set((state) => ({
      course: state.course ? { ...state.course, ...data } : null,
    })),

  toggleStatusLocally: (status) =>
    set((state) => ({
      course: state.course ? { ...state.course, status } : null,
    })),
}));
