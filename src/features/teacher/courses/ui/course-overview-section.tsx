import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CourseOverviewCard } from "./course-overview-card";
import { EditCourseOverviewModal } from "./edit-course-overview-modal";
import { ConfirmStatusDialog } from "./confirm-status-dialog";
import { useCourseOverviewStore } from "../model/course-overview-store";
import type { Course } from "../types";

interface CourseOverviewSectionProps {
  courseId: string;
}

// Dummy data generator for demonstration
function generateDummyCourse(id: string): Course {
  return {
    id,
    title: "Advanced React Patterns and Performance Optimization",
    description: "Learn how to build scalable, high-performance React applications using advanced patterns, hooks, and architectural best practices.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    price: 1500,
    durationDays: 45,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    lecturesCount: 24,
    enrolledStudentsCount: 156,
    status: "active",
    allowSeparateLectures: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function CourseOverviewSection({ courseId }: CourseOverviewSectionProps) {
  const { t } = useTranslation("teacherCourses");
  const course = useCourseOverviewStore((s) => s.course);
  const isLoading = useCourseOverviewStore((s) => s.isLoading);
  const setCourse = useCourseOverviewStore((s) => s.setCourse);
  const simulateLoading = useCourseOverviewStore((s) => s.simulateLoading);
  
  const openEditModal = useCourseOverviewStore((s) => s.openEditModal);
  const openConfirmDialog = useCourseOverviewStore((s) => s.openConfirmDialog);

  useEffect(() => {
    // In a real app we'd fetch data from an API here based on courseId
    simulateLoading();
    
    // Set dummy data after a short delay
    const timer = setTimeout(() => {
      setCourse(generateDummyCourse(courseId));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [courseId, setCourse, simulateLoading]);

  // Optionally show a "Not Found" state if not loading and course is null.
  // We'll skip that for now since we always generate dummy data.

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {t("overview.sectionTitle", "Course Overview")}
      </h2>
      
      <CourseOverviewCard
        course={course}
        isLoading={isLoading}
        onEdit={openEditModal}
        onToggleStatus={openConfirmDialog}
      />
      
      {/* Portal Modals */}
      <EditCourseOverviewModal />
      <ConfirmStatusDialog />
    </div>
  );
}
