import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
import { useCourseOverviewStore } from "../model/course-overview-store";

export function ConfirmStatusDialog() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCourseOverviewStore((s) => s.isConfirmDialogOpen);
  const course = useCourseOverviewStore((s) => s.course);
  const closeConfirmDialog = useCourseOverviewStore((s) => s.closeConfirmDialog);
  const toggleStatusLocally = useCourseOverviewStore((s) => s.toggleStatusLocally);

  if (!course) return null;

  const isActive = course.status === "active";
  const newStatus = isActive ? "inactive" : "active";

  const handleConfirm = () => {
    toggleStatusLocally(newStatus);
    closeConfirmDialog();
    toast.success(t("notifications.statusUpdated", "Course status updated"));
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeConfirmDialog()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("overview.confirmToggleTitle", "Change Course Status?")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("overview.confirmToggleDescription", {
              status: t(`status.${newStatus}`),
              defaultValue: `You are about to change the course status to "${newStatus}". Are you sure?`,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("overview.confirmToggleCancel", "Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {t("overview.confirmToggleConfirm", "Confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
