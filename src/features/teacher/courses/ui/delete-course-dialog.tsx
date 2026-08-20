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
import { useCoursesUIStore } from "../model/courses-ui-store";
import { useDeleteCourse } from "../hooks/use-delete-course";

export function DeleteCourseDialog() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCoursesUIStore((s) => s.isDeleteModalOpen);
  const deletingCourse = useCoursesUIStore((s) => s.deletingCourse);
  const closeDeleteModal = useCoursesUIStore((s) => s.closeDeleteModal);
  const { mutate: deleteCourseMutate, isPending } = useDeleteCourse();

  const handleConfirm = () => {
    if (!deletingCourse) return;
    deleteCourseMutate(deletingCourse.id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeDeleteModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialog.description", { title: deletingCourse?.title ?? "" })}
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
