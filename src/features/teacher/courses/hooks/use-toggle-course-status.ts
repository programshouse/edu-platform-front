import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleCourseStatus } from "../api";
import type { ToggleCourseStatusPayload } from "../types";
import { useTranslation } from "react-i18next";

export function useToggleCourseStatus() {
  const { t } = useTranslation("teacherCourses");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ToggleCourseStatusPayload) => toggleCourseStatus(payload),
    // Optimistic update
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["teacher", "courses"] });
      const previousData = queryClient.getQueryData(["teacher", "courses"]);
      queryClient.setQueriesData(
        { queryKey: ["teacher", "courses"] },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;
          const data = old as { data: { id: string; status: string }[] };
          return {
            ...data,
            data: data.data?.map((c) =>
              c.id === id ? { ...c, status } : c
            ),
          };
        }
      );
      return { previousData };
    },
    onError: (err: { message: string }, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: ["teacher", "courses"] }, context.previousData);
      }
      toast.error(err.message ?? t("notifications.error"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    },
    onSuccess: () => {
      toast.success(t("notifications.statusUpdated"));
    },
  });
}
