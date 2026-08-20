import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCourse } from "../api";
import { useCoursesUIStore } from "../model/courses-ui-store";
import { useTranslation } from "react-i18next";

export function useDeleteCourse() {
  const { t } = useTranslation("teacherCourses");
  const queryClient = useQueryClient();
  const closeDeleteModal = useCoursesUIStore((s) => s.closeDeleteModal);

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
      closeDeleteModal();
      toast.success(t("notifications.courseDeleted"));
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? t("notifications.error"));
    },
  });
}
