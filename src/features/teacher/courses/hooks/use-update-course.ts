import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCourse } from "../api";
import { useCoursesUIStore } from "../model/courses-ui-store";
import type { UpdateCoursePayload } from "../types";
import { useTranslation } from "react-i18next";

export function useUpdateCourse() {
  const { t } = useTranslation("teacherCourses");
  const queryClient = useQueryClient();
  const closeEditModal = useCoursesUIStore((s) => s.closeEditModal);

  return useMutation({
    mutationFn: (payload: UpdateCoursePayload) => updateCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
      closeEditModal();
      toast.success(t("notifications.courseUpdated"));
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? t("notifications.error"));
    },
  });
}
