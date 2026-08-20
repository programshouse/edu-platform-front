import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCourse } from "../api";
import { useCoursesUIStore } from "../model/courses-ui-store";
import type { CreateCoursePayload } from "../types";
import { useTranslation } from "react-i18next";

export function useCreateCourse() {
  const { t } = useTranslation("teacherCourses");
  const queryClient = useQueryClient();
  const closeCreateModal = useCoursesUIStore((s) => s.closeCreateModal);

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
      closeCreateModal();
      toast.success(t("notifications.courseCreated"));
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? t("notifications.error"));
    },
  });
}
