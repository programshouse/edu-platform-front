import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CourseBanner } from "./components/course-banner";
import { CourseInfoCard } from "./components/course-info-card";
import { CourseContent } from "./components/course-content";
import { Footer } from "@/features/landing/components/footer";

type Lecture = {
  title: string;
  duration: string;
  isFree: boolean;
};

type TestOrAssignment = {
  title: string;
  type: "quiz" | "assignment";
};

type CourseItem = {
  title: string;
  description: string;
  detailedDescription: string;
  students: number;
  lessons: number;
  hours: number;
  level: string;
  price: number;
  category: string;
  image: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  availabilityPeriod: number;
  purchaseSeparately: boolean;
  lectures: Lecture[];
  testsAndAssignments: TestOrAssignment[];
};

export function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("courses");

  const courses = t("items", { returnObjects: true }) as CourseItem[];
  const courseIndex = Number(id);

  if (isNaN(courseIndex) || courseIndex < 0 || courseIndex >= courses.length) {
    return <Navigate to="/courses" replace />;
  }

  const course = courses[courseIndex];

  return (
    <>
      {/* Banner */}
      <CourseBanner
        bannerImage={course.bannerImage}
        title={course.title}
        level={course.level}
      />

      {/* Main Content */}
      <section className="py-10 lg:py-14 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Left — Course Content */}
            <div className="flex-1 min-w-0">
              <CourseContent
                courseId={String(courseIndex)}
                detailedDescription={course.detailedDescription}
                lectures={course.lectures}
                testsAndAssignments={course.testsAndAssignments}
              />
            </div>

            {/* Right — Info Card Sidebar */}
            <div className="w-full lg:w-[360px] shrink-0">
              <CourseInfoCard
                price={course.price}
                availabilityPeriod={course.availabilityPeriod}
                startDate={course.startDate}
                endDate={course.endDate}
                lessons={course.lessons}
                purchaseSeparately={course.purchaseSeparately}
                students={course.students}
                level={course.level}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
