export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends UserEntity {
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
}
