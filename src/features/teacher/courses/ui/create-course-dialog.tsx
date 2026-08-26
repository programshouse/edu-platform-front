import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { useCoursesUIStore } from "../model/courses-ui-store";
import { useCreateCourse } from "../hooks/use-create-course";
import { CourseForm } from "./course-form";
import type { CourseFormValues } from "../model/course-schema";

// ─── We need ScrollArea — install it if not present ───
// It's used to make tall forms scrollable inside the dialog

export function CreateCourseDialog() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCoursesUIStore((s) => s.isCreateModalOpen);
  const closeCreateModal = useCoursesUIStore((s) => s.closeCreateModal);
  const { mutate: createCourse, isPending } = useCreateCourse();

  const handleSubmit = (data: CourseFormValues) => {
    createCourse({
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCreateModal()}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("createDialog.title")}</DialogTitle>
          <DialogDescription>{t("createDialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pe-1">
          <CourseForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel={t("createDialog.submit")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
