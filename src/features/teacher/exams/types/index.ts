import { z } from "zod";

// ─── Exam Status ───
export type ExamStatus = "draft" | "published" | "active" | "inactive";

// ─── Question Types ───
export type QuestionType = "mcq" | "tf" | "essay";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  // For MCQ
  options?: QuestionOption[];
  // For MCQ & T/F (for MCQ it's option ID, for T/F it's "true" or "false")
  correctAnswer?: string;
}

// ─── Exam Settings ───
export interface ExamSettings {
  questionOrder: "fixed" | "random";
  shuffleAnswers: boolean;
  timeBehavior: "start_on_attempt" | "scheduled";
  availabilityStart: string | null;
  availabilityEnd: string | null;
  attemptsLogic: "highest" | "last";
  resultVisibility: "immediately" | "hide" | "after_submission";
  essayHandling: "publish_without" | "wait_manual";
}

// ─── Core Exam Entity ───
export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  questionsCount: number;
  totalGrade: number;
  durationMins: number;
  attemptsAllowed: number;
  passingGrade: number | null;
  status: ExamStatus;
  questions: Question[];
  settings: ExamSettings;
  createdAt: string;
  updatedAt: string;
}

// ─── Filters & Pagination ───
export interface ExamsFilters {
  search: string;
  course: string;
  status: ExamStatus | "";
  dateFrom: string;
  dateTo: string;
}

export interface ExamsPagination {
  page: number;
  pageSize: number;
}

export type ExamsQueryParams = ExamsFilters & ExamsPagination;

// ─── API Payloads ───
export interface ToggleExamStatusPayload {
  id: string;
  status: ExamStatus;
}

// ─── UI State ───
export interface ExamsUIState {
  isDeleteModalOpen: boolean;
  deletingExam: Exam | null;
}

// ─── Zod Schemas for Builder ───

const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text is required"),
});

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(["mcq", "tf", "essay"]),
  text: z.string().min(1, "Question text is required"),
  points: z.number().min(1, "Points must be at least 1"),
  options: z.array(optionSchema).optional(),
  correctAnswer: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === "mcq") {
      return (data.options?.length ?? 0) >= 2 && !!data.correctAnswer;
    }
    if (data.type === "tf") {
      return !!data.correctAnswer;
    }
    return true; // Essay doesn't need options/correctAnswer
  },
  {
    message: "Invalid question configuration",
    path: ["correctAnswer"],
  }
);

export const examBuilderSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  courseId: z.string().min(1, "Course is required"),
  durationMins: z.number().min(1, "Duration must be at least 1 minute"),
  attemptsAllowed: z.number().min(1, "Attempts must be at least 1"),
  passingGrade: z.number().min(0).nullable().optional(),
  status: z.enum(["draft", "published", "active", "inactive"]),
  questions: z.array(questionSchema),
  settings: z.object({
    questionOrder: z.enum(["fixed", "random"]),
    shuffleAnswers: z.boolean(),
    timeBehavior: z.enum(["start_on_attempt", "scheduled"]),
    availabilityStart: z.string().nullable(),
    availabilityEnd: z.string().nullable(),
    attemptsLogic: z.enum(["highest", "last"]),
    resultVisibility: z.enum(["immediately", "hide", "after_submission"]),
    essayHandling: z.enum(["publish_without", "wait_manual"]),
  }),
});

export type ExamBuilderFormData = z.infer<typeof examBuilderSchema>;
