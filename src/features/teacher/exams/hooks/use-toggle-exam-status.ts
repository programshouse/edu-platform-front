import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { toggleExamStatus } from "../api";
import type { Exam } from "../types";
import type { PaginatedResponse } from "@/shared/api";

export function useToggleExamStatus() {
  const { t } = useTranslation("teacherExams");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleExamStatus,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["teacher", "exams"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["teacher", "exams"],
      });

      queryClient.setQueriesData(
        { queryKey: ["teacher", "exams"] },
        (old: PaginatedResponse<Exam> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((exam: Exam) =>
              exam.id === variables.id
                ? { ...exam, status: variables.status }
                : exam
            ),
          };
        }
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success(t("notifications.statusUpdated"));
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error.message || t("notifications.error");
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "exams"] });
    },
  });
}
