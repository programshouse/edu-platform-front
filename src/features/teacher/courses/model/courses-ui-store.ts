import { create } from "zustand";
import type { Course } from "../types";

// ─── State & Actions ───
interface CoursesUIState {
  // Modals
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Target course for edit / delete
  editingCourse: Course | null;
  deletingCourse: Course | null;

  // Actions
  openCreateModal: () => void;
  closeCreateModal: () => void;

  openEditModal: (course: Course) => void;
  closeEditModal: () => void;

  openDeleteModal: (course: Course) => void;
  closeDeleteModal: () => void;

  resetAll: () => void;
}

export const useCoursesUIStore = create<CoursesUIState>((set) => ({
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  editingCourse: null,
  deletingCourse: null,

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  openEditModal: (course) =>
    set({ isEditModalOpen: true, editingCourse: course }),
  closeEditModal: () =>
    set({ isEditModalOpen: false, editingCourse: null }),

  openDeleteModal: (course) =>
    set({ isDeleteModalOpen: true, deletingCourse: course }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, deletingCourse: null }),

  resetAll: () =>
    set({
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      editingCourse: null,
      deletingCourse: null,
    }),
}));
