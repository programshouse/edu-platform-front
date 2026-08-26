import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { useCoursesUIStore } from "../model/courses-ui-store";
import { useUpdateCourse } from "../hooks/use-update-course";
import { CourseForm, courseToFormValues } from "./course-form";
import type { CourseFormValues } from "../model/course-schema";

export function EditCourseDialog() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCoursesUIStore((s) => s.isEditModalOpen);
  const editingCourse = useCoursesUIStore((s) => s.editingCourse);
  const closeEditModal = useCoursesUIStore((s) => s.closeEditModal);
  const { mutate: updateCourse, isPending } = useUpdateCourse();

  if (!editingCourse) return null;

  const handleSubmit = (data: CourseFormValues) => {
    updateCourse({
      id: editingCourse.id,
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
          {/* Re-mount form when editing course changes */}
          <CourseForm
            key={editingCourse.id}
            defaultValues={courseToFormValues(editingCourse)}
            existingCover={editingCourse.coverImage}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel={t("editDialog.submit")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
