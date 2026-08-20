export interface CourseEntity {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  instructorName: string;
  price: number;
  currency: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  tags: string[];
  totalLessons: number;
  totalHours: number;
  enrolledStudents: number;
  rating: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  type: "video" | "article" | "quiz";
  duration: number; // in minutes
  order: number;
  isFree: boolean;
}
