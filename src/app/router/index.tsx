import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PublicLayout } from "@/app/layouts/public-layout";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { AuthGuard } from "./guards/auth-guard";
import { RoleGuard } from "./guards/role-guard";
import { LandingPage } from "@/features/landing/page";
import { CoursesPage } from "@/features/courses/page";
import { CourseDetailsPage } from "@/features/courses/course-details-page";
import { LectureDetailsPage } from "@/features/courses/lecture-details-page";
import { AboutPage } from "@/features/about/page";
import { ContactPage } from "@/features/contact/page";
import { NotFoundPage } from "@/features/errors/not-found";
import { UnauthorizedPage } from "@/features/errors/unauthorized";
import { LoginPage } from "@/features/auth/login-page";
import { SignUpPage } from "@/features/auth/signup-page";
import { TestPage } from "@/features/courses/test-page";
import { AssignmentPage } from "@/features/courses/assignment-page";
import { ProfilePage } from "@/features/profile/page";
import { TeacherDashboardPage } from "@/features/teacher/page";
import { TeacherCoursesPage } from "@/features/teacher/courses/page";
import { TeacherCourseDetailsPage } from "@/features/teacher/courses/course-details-page";
import { TeacherExamsPage } from "@/features/teacher/exams/page";
import { ExamBuilderPage } from "@/features/teacher/exams/ui/builder/exam-builder-page";

const router = createBrowserRouter([
  // ─── Public Routes ───
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/courses",
        element: <CoursesPage />,
      },
      {
        path: "/courses/:id",
        element: <CourseDetailsPage />,
      },
      {
        path: "/courses/:courseId/lectures/:lectureIndex",
        element: <LectureDetailsPage />,
      },
      {
        path: "/courses/:courseId/lectures/:lectureIndex/test/:testId",
        element: <TestPage />,
      },
      {
        path: "/courses/:courseId/lectures/:lectureIndex/assignment/:assignmentId",
        element: <AssignmentPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <SignUpPage />,
      },
    ],
  },

  // ─── Teacher Dashboard Routes ───
  {
    path: "/teacher",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={["teacher"]}>
          <DashboardLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <TeacherDashboardPage />,
      },
      {
        path: "courses",
        element: <TeacherCoursesPage />,
      },
      {
        path: "courses/:id",
        element: <TeacherCourseDetailsPage />,
      },
      {
        path: "students",
        element: <div>Students — Coming Soon</div>,
      },
      {
        path: "exams",
        element: <TeacherExamsPage />,
      },
      {
        path: "exams/create",
        element: <ExamBuilderPage />,
      },
      {
        path: "exams/:id/edit",
        element: <ExamBuilderPage />,
      },
      {
        path: "exams/:id/results",
        element: <div className="p-8">Exam Results — Coming Soon</div>,
      },
      {
        path: "exams/:id/grading",
        element: <div className="p-8">Exam Grading — Coming Soon</div>,
      },
      {
        path: "assignments",
        element: <div>Assignments — Coming Soon</div>,
      },
      {
        path: "earnings",
        element: <div>Earnings — Coming Soon</div>,
      },
      {
        path: "notifications",
        element: <div>Notifications — Coming Soon</div>,
      },
      {
        path: "settings",
        element: <div>Settings — Coming Soon</div>,
      },
    ],
  },

  // ─── Student Dashboard Routes ───
  {
    path: "/profile",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={["student"]}>
          <PublicLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
    ],
  },

  // ─── Error Routes ───
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
