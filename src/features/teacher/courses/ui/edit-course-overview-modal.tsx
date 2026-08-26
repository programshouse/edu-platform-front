import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { CourseForm, courseToFormValues } from "./course-form";
import { useCourseOverviewStore } from "../model/course-overview-store";
import { useUpdateCourse } from "../hooks/use-update-course";
import type { CourseFormValues } from "../model/course-schema";

export function EditCourseOverviewModal() {
  const { t } = useTranslation("teacherCourses");
  const isOpen       = useCourseOverviewStore((s) => s.isEditModalOpen);
  const course       = useCourseOverviewStore((s) => s.course);
  const closeEditModal = useCourseOverviewStore((s) => s.closeEditModal);

  const { mutate: updateCourse, isPending } = useUpdateCourse();

  if (!course) return null;

  const handleSubmit = (data: CourseFormValues) => {
    updateCourse({
      id: course.id,
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      categoryId: data.categoryId,
      price: data.price,
      level: data.level,
      accessDurationDays: data.accessDurationDays,
      totalDurationMinutes: data.totalDurationMinutes,
      startDate: data.startDate,
      ...(data.endDate ? { endDate: data.endDate } : {}),
      allowSeparateLectures: data.allowSeparateLectures,
      ...(data.coverImage instanceof File ? { coverImage: data.coverImage } : {}),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeEditModal()}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("editDialog.title")}</DialogTitle>
          <DialogDescription>{t("editDialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pe-1">
          <CourseForm
            key={course.id}
            defaultValues={courseToFormValues(course)}
            existingCover={course.coverImage}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel={t("editDialog.submit")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
