import { create } from "zustand";

export interface Lecture {
  id: string;
  title: string;
  type: "video" | "live";
  duration: string;
  status: "visible" | "hidden";
}

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
  dueDate: string;
  submissionsCount: number;
}

interface CourseContentState {
  // Data
  lectures: Lecture[];
  exams: Exam[];
  assignments: Assignment[];
  
  // Loading states
  isLoadingLectures: boolean;
  isLoadingExams: boolean;
  isLoadingAssignments: boolean;

  // Modals state
  isAddLectureModalOpen: boolean;
  editingLecture: Lecture | null;
  
  isAddAssignmentModalOpen: boolean;
  editingAssignment: Assignment | null;

  // Actions
  setLectures: (lectures: Lecture[]) => void;
  setExams: (exams: Exam[]) => void;
  setAssignments: (assignments: Assignment[]) => void;

  openLectureModal: (lecture?: Lecture) => void;
  closeLectureModal: () => void;

  openAssignmentModal: (assignment?: Assignment) => void;
  closeAssignmentModal: () => void;
}

// Dummy initial data
const DUMMY_LECTURES: Lecture[] = [
  { id: "1", title: "Introduction to React", type: "video", duration: "12m 30s", status: "visible" },
  { id: "2", title: "State Management in Depth", type: "video", duration: "45m 00s", status: "visible" },
  { id: "3", title: "Live Q&A Session", type: "live", duration: "60m 00s", status: "hidden" },
];

const DUMMY_EXAMS: Exam[] = [
  { id: "1", title: "Midterm Exam", questionsCount: 20, totalGrade: 40, durationMinutes: 60, attemptsAllowed: 1 },
];

const DUMMY_ASSIGNMENTS: Assignment[] = [
  { id: "1", title: "Build a Todo App", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), submissionsCount: 12 },
];

export const useCourseContentStore = create<CourseContentState>((set) => ({
  lectures: DUMMY_LECTURES,
  exams: DUMMY_EXAMS,
  assignments: DUMMY_ASSIGNMENTS,

  isLoadingLectures: false,
  isLoadingExams: false,
  isLoadingAssignments: false,

  isAddLectureModalOpen: false,
  editingLecture: null,

  isAddAssignmentModalOpen: false,
  editingAssignment: null,

  setLectures: (lectures) => set({ lectures }),
  setExams: (exams) => set({ exams }),
  setAssignments: (assignments) => set({ assignments }),

  openLectureModal: (lecture) => set({ isAddLectureModalOpen: true, editingLecture: lecture || null }),
  closeLectureModal: () => set({ isAddLectureModalOpen: false, editingLecture: null }),

  openAssignmentModal: (assignment) => set({ isAddAssignmentModalOpen: true, editingAssignment: assignment || null }),
  closeAssignmentModal: () => set({ isAddAssignmentModalOpen: false, editingAssignment: null }),
}));
