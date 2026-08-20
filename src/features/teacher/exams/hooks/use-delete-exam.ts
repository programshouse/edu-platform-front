import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteExam } from "../api";
import { useExamsUIStore } from "../model/exams-ui-store";

export function useDeleteExam() {
  const { t } = useTranslation("teacherExams");
  const queryClient = useQueryClient();
  const closeDeleteModal = useExamsUIStore((s) => s.closeDeleteModal);

  return useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "exams"] });
      toast.success(t("notifications.examDeleted"));
      closeDeleteModal();
    },
    onError: (error) => {
      const message = error.message || t("notifications.error");
      toast.error(message);
    },
  });
}
