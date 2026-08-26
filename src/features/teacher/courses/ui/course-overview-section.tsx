import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { CourseOverviewCard } from "./course-overview-card";
import { EditCourseOverviewModal } from "./edit-course-overview-modal";
import { ConfirmStatusDialog } from "./confirm-status-dialog";
import { useCourseOverviewStore } from "../model/course-overview-store";
import { useCourseContentStore } from "../model/course-content-store";
import { fetchCourse, fetchCourseLectures } from "../api";

interface CourseOverviewSectionProps {
  courseId: string;
}

export function CourseOverviewSection({ courseId }: CourseOverviewSectionProps) {
  const { t } = useTranslation("teacherCourses");

  const setCourse      = useCourseOverviewStore((s) => s.setCourse);
  const openEditModal  = useCourseOverviewStore((s) => s.openEditModal);
  const openConfirm    = useCourseOverviewStore((s) => s.openConfirmDialog);
  const course         = useCourseOverviewStore((s) => s.course);

  const setCourseId       = useCourseContentStore((s) => s.setCourseId);
  const setLectures       = useCourseContentStore((s) => s.setLectures);
  const setLoadingLectures = useCourseContentStore((s) => s.setLoadingLectures);

  // ── Fetch course overview ──
  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["teacher", "course", courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId,
  });

  // ── Fetch lectures ──
  const { data: lecturesData, isLoading: isLoadingLectures } = useQuery({
    queryKey: ["teacher", "course", courseId, "lectures"],
    queryFn: () => fetchCourseLectures(courseId),
    enabled: !!courseId,
  });

  // Sync course into store
  useEffect(() => {
    if (courseData) setCourse(courseData);
  }, [courseData, setCourse]);

  // Sync courseId + lectures into content store
  useEffect(() => {
    setCourseId(courseId);
  }, [courseId, setCourseId]);

  useEffect(() => {
    setLoadingLectures(isLoadingLectures);
    if (lecturesData) setLectures(lecturesData);
  }, [lecturesData, isLoadingLectures, setLectures, setLoadingLectures]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {t("overview.sectionTitle", "Course Overview")}
      </h2>

      <CourseOverviewCard
        course={course}
        isLoading={isLoadingCourse}
        onEdit={openEditModal}
        onToggleStatus={openConfirm}
      />

      {/* Portal Modals */}
      <EditCourseOverviewModal />
      <ConfirmStatusDialog />
    </div>
  );
}
