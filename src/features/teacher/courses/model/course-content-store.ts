import { create } from "zustand";
import type { LectureItem } from "../api";

export type { LectureItem };

export interface Exam {
  id: string;
  title: string;
  questionsCount: number;
  totalGrade: number;
  durationMinutes: number;
  attemptsAllowed: number;
}

export interface Assignment {
  id: string;
  title: string;
  title_en?: string;
  title_ar?: string;
  description?: string;
  dueDate: string;
  submissionsCount: number;
  totalGrade?: number;
  courseId?: string;
}

interface CourseContentState {
  courseId: string | null;

  // Data
  lectures: LectureItem[];
  exams: Exam[];
  assignments: Assignment[];

  // Loading states
  isLoadingLectures: boolean;
  isLoadingExams: boolean;
  isLoadingAssignments: boolean;

  // Modals
  isAddLectureModalOpen: boolean;
  editingLecture: LectureItem | null;

  isAddAssignmentModalOpen: boolean;
  editingAssignment: Assignment | null;

  // Actions
  setCourseId: (id: string) => void;
  setLectures: (lectures: LectureItem[]) => void;
  setLoadingLectures: (v: boolean) => void;
  setExams: (exams: Exam[]) => void;
  setAssignments: (assignments: Assignment[]) => void;
  setLoadingExams: (v: boolean) => void;
  setLoadingAssignments: (v: boolean) => void;

  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  openLectureModal: (lecture?: LectureItem) => void;
  closeLectureModal: () => void;

  openAssignmentModal: (assignment?: Assignment) => void;
  closeAssignmentModal: () => void;
}

export const useCourseContentStore = create<CourseContentState>((set) => ({
  courseId: null,
  lectures: [],
  exams: [],
  assignments: [],

  isLoadingLectures: false,
  isLoadingExams: false,
  isLoadingAssignments: false,

  isAddLectureModalOpen: false,
  editingLecture: null,

  isAddAssignmentModalOpen: false,
  editingAssignment: null,

  setCourseId: (id) => set({ courseId: id }),
  setLectures: (lectures) => set({ lectures }),
  setLoadingLectures: (v) => set({ isLoadingLectures: v }),
  setExams: (exams) => set({ exams }),
  setAssignments: (assignments) => set({ assignments }),
  setLoadingExams: (v) => set({ isLoadingExams: v }),
  setLoadingAssignments: (v) => set({ isLoadingAssignments: v }),

  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),

  updateAssignment: (id, updated) =>
    set((state) => ({
      assignments: state.assignments.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      ),
    })),

  deleteAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((item) => item.id !== id),
    })),

  openLectureModal: (lecture) => set({ isAddLectureModalOpen: true, editingLecture: lecture ?? null }),
  closeLectureModal: () => set({ isAddLectureModalOpen: false, editingLecture: null }),

  openAssignmentModal: (assignment) => set({ isAddAssignmentModalOpen: true, editingAssignment: assignment ?? null }),
  closeAssignmentModal: () => set({ isAddAssignmentModalOpen: false, editingAssignment: null }),
}));
