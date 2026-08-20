import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useExamsUIStore } from "../model/exams-ui-store";
import { useDeleteExam } from "../hooks/use-delete-exam";

export function ConfirmDeleteDialog() {
  const { t } = useTranslation("teacherExams");
  const isOpen = useExamsUIStore((s) => s.isDeleteModalOpen);
  const deletingExam = useExamsUIStore((s) => s.deletingExam);
  const closeDeleteModal = useExamsUIStore((s) => s.closeDeleteModal);
  const { mutate: deleteExamMutate, isPending } = useDeleteExam();

  const handleConfirm = () => {
    if (!deletingExam) return;
    deleteExamMutate(deletingExam.id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeDeleteModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialog.description", { title: deletingExam?.title ?? "" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t("deleteDialog.deleting") : t("deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
