import type { Exam } from "../types";

const defaultSettings: Exam["settings"] = {
  questionOrder: "fixed",
  shuffleAnswers: false,
  timeBehavior: "start_on_attempt",
  availabilityStart: null,
  availabilityEnd: null,
  attemptsLogic: "highest",
  resultVisibility: "immediately",
  essayHandling: "wait_manual",
};

export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Midterm React Assessment",
    courseId: "course-1",
    courseName: "React JS - Zero to Hero",
    questionsCount: 2,
    totalGrade: 100,
    durationMins: 60,
    attemptsAllowed: 1,
    passingGrade: 50,
    status: "active",
    questions: [
      {
        id: "q-1",
        type: "mcq",
        text: "What is the purpose of useEffect?",
        points: 50,
        options: [
          { id: "opt-1", text: "To perform side effects" },
          { id: "opt-2", text: "To render UI" },
        ],
        correctAnswer: "opt-1",
      },
      {
        id: "q-2",
        type: "tf",
        text: "React uses a virtual DOM.",
        points: 50,
        correctAnswer: "true",
      },
    ],
    settings: { ...defaultSettings },
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "exam-2",
    title: "Node.js Fundamentals Quiz",
    courseId: "course-2",
    courseName: "Node.js Basics",
    questionsCount: 1,
    totalGrade: 30,
    durationMins: 30,
    attemptsAllowed: 2,
    passingGrade: 15,
    status: "draft",
    questions: [
      {
        id: "q-3",
        type: "essay",
        text: "Explain the Event Loop in Node.js.",
        points: 30,
      },
    ],
    settings: { ...defaultSettings },
    createdAt: "2024-03-05T14:30:00Z",
    updatedAt: "2024-03-05T14:30:00Z",
  },
];
