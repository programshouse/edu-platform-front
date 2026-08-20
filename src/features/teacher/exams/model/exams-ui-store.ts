import { create } from "zustand";
import type { Exam } from "../types";

interface ExamsUIState {
  isDeleteModalOpen: boolean;
  deletingExam: Exam | null;

  openDeleteModal: (exam: Exam) => void;
  closeDeleteModal: () => void;
  resetAll: () => void;
}

export const useExamsUIStore = create<ExamsUIState>((set) => ({
  isDeleteModalOpen: false,
  deletingExam: null,

  openDeleteModal: (exam) =>
    set({ isDeleteModalOpen: true, deletingExam: exam }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, deletingExam: null }),

  resetAll: () =>
    set({
      isDeleteModalOpen: false,
      deletingExam: null,
    }),
}));
