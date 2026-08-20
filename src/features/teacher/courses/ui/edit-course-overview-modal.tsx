import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { CourseForm, courseToFormValues } from "./course-form";
import { useCourseOverviewStore } from "../model/course-overview-store";
import type { CourseFormValues } from "../model/course-schema";

export function EditCourseOverviewModal() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCourseOverviewStore((s) => s.isEditModalOpen);
  const course = useCourseOverviewStore((s) => s.course);
  const closeEditModal = useCourseOverviewStore((s) => s.closeEditModal);
  const updateCourseLocally = useCourseOverviewStore((s) => s.updateCourseLocally);

  if (!course) return null;

  const handleSubmit = (data: CourseFormValues) => {
    // Note: In a real app we'd call an API here.
    // For now, we update local store to simulate a successful API call
    updateCourseLocally({
      title: data.title,
      description: data.description,
      price: data.price,
      durationDays: data.durationDays,
      startDate: data.startDate,
      endDate: data.endDate,
      allowSeparateLectures: data.allowSeparateLectures,
      ...(data.coverImage instanceof File
        ? { coverImage: URL.createObjectURL(data.coverImage) }
        : {}),
    });
    
    closeEditModal();
    toast.success(t("notifications.courseUpdated", "Course updated successfully"));
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
            submitLabel={t("editDialog.submit")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
