import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TeacherPageLayout } from "../components/teacher-page-layout";
import { CourseOverviewSection } from "./ui/course-overview-section";
import { CourseTabs } from "./ui/course-tabs";
import { Separator } from "@/shared/components/ui/separator";

export function TeacherCourseDetailsPage() {
  const { t, i18n } = useTranslation("teacherCourses");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isRtl = i18n.language === "ar";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">
          {t("overview.notFound", "Course not found")}
        </p>
      </div>
    );
  }

  return (
    <TeacherPageLayout
      headerContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/teacher/courses")}
            className="text-muted-foreground hover:text-foreground"
          >
            <BackIcon className="size-4 me-1.5" />
            {t("coursesList", "Courses list")}
          </Button>

          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-sm font-semibold leading-tight text-foreground truncate hidden sm:block">
            {t("overview.sectionTitle", "Course Details")}
          </h1>
        </>
      }
    >
      {/* ── Page Content ── */}
      <main className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl flex flex-col gap-8 pb-12">
          {/* The new Overview Section wrapper */}
          <CourseOverviewSection courseId={id} />

          {/* Course Content Tabs (Lectures, Exams, Assignments) */}
          <CourseTabs />
        </div>
      </main>
    </TeacherPageLayout>
  );
}
