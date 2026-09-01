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
import { EnrollCoursePage } from "@/features/student/enroll/page";

import { ProfilePage } from "@/features/profile/page";

import { TeacherDashboardPage } from "@/features/teacher/page";
import { TeacherCoursesPage } from "@/features/teacher/courses/page";
import { TeacherCourseDetailsPage } from "@/features/teacher/courses/course-details-page";
import { TeacherExamsPage } from "@/features/teacher/exams/page";
import { ExamBuilderPage } from "@/features/teacher/exams/ui/builder/exam-builder-page";
import StudentCoursePage from "@/features/student/course/page";


const router = createBrowserRouter([


  // =========================
  // PUBLIC ROUTES
  // =========================

  {
    element:<PublicLayout />,

    children:[

      {
        path:"/",
        element:<LandingPage />,
      },


      {
        path:"/courses",
        element:<CoursesPage />,
      },


      {
        path:"/courses/:id",
        element:<CourseDetailsPage />,
      },

      {
        path:"/student/courses/:courseId/enroll",
        element:<EnrollCoursePage />,
      },


      {
        path:"/courses/:courseId/lectures/:lectureIndex",
        element:<LectureDetailsPage />,
      },


      {
        path:"/courses/:courseId/lectures/:lectureIndex/test/:testId",
        element:<TestPage />,
      },


      {
        path:"/courses/:courseId/lectures/:lectureIndex/assignment/:assignmentId",
        element:<AssignmentPage />,
      },

{
  path:"/student/courses/:courseId",
  element:<StudentCoursePage />,
},
      {
        path:"/about",
        element:<AboutPage />,
      },


      {
        path:"/contact",
        element:<ContactPage />,
      },


      {
        path:"/login",
        element:<LoginPage />,
      },


      {
        path:"/register",
        element:<SignUpPage />,
      },


    ],
  },




  // =========================
  // INSTRUCTOR / TEACHER DASHBOARD
  // =========================

  {
    path:"/teacher",

    element:(

      <AuthGuard>

        <RoleGuard
          allowedRoles={[
            "teacher",
            "instructor"
          ]}
        >

          <DashboardLayout />

        </RoleGuard>

      </AuthGuard>

    ),


    children:[


      {
        index:true,
        element:<TeacherDashboardPage />,
      },


      {
        path:"courses",
        element:<TeacherCoursesPage />,
      },


      {
        path:"courses/:id",
        element:<TeacherCourseDetailsPage />,
      },


      {
        path:"students",
        element:
          <div>
            Students — Coming Soon
          </div>,
      },


      {
        path:"exams",
        element:<TeacherExamsPage />,
      },


      {
        path:"exams/create",
        element:<ExamBuilderPage />,
      },


      {
        path:"exams/:id/edit",
        element:<ExamBuilderPage />,
      },


      {
        path:"exams/:id/results",
        element:
          <div className="p-8 bg-white rounded-2xl shadow m-8"><h1 className="text-2xl font-bold">نتائج الاختبار</h1><div className="grid md:grid-cols-3 gap-4 mt-6"><div className="p-5 bg-blue-50 rounded-xl">الدرجة<br/><b>18 / 20</b></div><div className="p-5 bg-green-50 rounded-xl">الحالة<br/><b>ناجح</b></div><div className="p-5 bg-gray-50 rounded-xl">النسبة<br/><b>90%</b></div></div></div>,
      },


      {
        path:"exams/:id/grading",
        element:
          <div className="p-8 bg-white rounded-2xl shadow m-8"><h1 className="text-2xl font-bold">تصحيح الاختبار</h1><div className="mt-6 space-y-4"><div className="p-5 border rounded-xl">السؤال الأول<br/><span className="text-red-500">إجابة الطالب: خطأ</span><br/><span className="text-green-600">الإجابة الصحيحة: صحيحة</span></div></div></div>,
      },


      {
        path:"assignments",
        element:
          <div>
            Assignments — Coming Soon
          </div>,
      },


      {
        path:"earnings",
        element:
          <div>
            Earnings — Coming Soon
          </div>,
      },


      {
        path:"notifications",
        element:
          <div>
            Notifications — Coming Soon
          </div>,
      },


      {
        path:"settings",
        element:
          <div>
            Settings — Coming Soon
          </div>,
      },


    ],

  },





  // =========================
  // STUDENT PROFILE
  // =========================

  {
    path:"/profile",

    element:(

      <AuthGuard>

        <RoleGuard
          allowedRoles={[
            "student"
          ]}
        >

          <PublicLayout />

        </RoleGuard>


      </AuthGuard>

    ),


    children:[

      {
        index:true,
        element:<ProfilePage />,
      },

    ],

  },





  // =========================
  // ERROR ROUTES
  // =========================

  {
    path:"/unauthorized",
    element:<UnauthorizedPage />,
  },


  {
    path:"*",
    element:<NotFoundPage />,
  },


]);




export function AppRouter(){

  return (

    <RouterProvider
      router={router}
    />

  );

}