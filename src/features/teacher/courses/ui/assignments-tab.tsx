import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, CalendarDays, Eye, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
import { useCourseContentStore, type Assignment } from "../model/course-content-store";
import { AddAssignmentModal } from "./add-assignment-modal";
import { AssignmentShowModal } from "./assignment-show-modal";

export function AssignmentsTab() {
  const { t, i18n } = useTranslation("teacherCourses");
  const isAr = i18n.language.startsWith("ar");

  const assignments = useCourseContentStore((s) => s.assignments);
  const isLoading = useCourseContentStore((s) => s.isLoadingAssignments);
  const openAssignmentModal = useCourseContentStore((s) => s.openAssignmentModal);
  const deleteAssignment = useCourseContentStore((s) => s.deleteAssignment);

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);

  const handleShowAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsShowModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingAssignment) return;
    deleteAssignment(deletingAssignment.id);
    toast.success(t("assignments.deleted", "Assignment deleted successfully"));
    setDeletingAssignment(null);
  };

  const formatDateSafe = (dateString: string) => {
    try {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("assignments.title", "Assignments")}</h3>
        <Button onClick={() => openAssignmentModal()} size="sm">
          <Plus className="size-4 me-2" />
          {t("assignments.add", "Add Assignment")}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">{t("assignments.name", "Title")}</TableHead>
              <TableHead>{t("assignments.dueDate", "Due Date")}</TableHead>
              <TableHead>{t("assignments.submissions", "Submissions")}</TableHead>
              <TableHead>{t("assignments.grade", "Max Points")}</TableHead>
              <TableHead className="text-end">{t("assignments.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell className="text-end"><Skeleton className="h-8 w-[100px] inline-block" /></TableCell>
                </TableRow>
              ))
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground hover:bg-transparent">
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-sm">
                        {t("assignments.noAssignments", "No assignments added to this course yet")}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {t(
                          "assignments.noAssignmentsHint",
                          "Add an assignment to let students submit homework and get feedback."
                        )}
                      </p>
                    </div>
                    <Button onClick={() => openAssignmentModal()} size="sm" variant="outline" className="mt-1">
                      <Plus className="size-4 me-1.5" />
                      {t("assignments.add", "Add Assignment")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="size-4 text-primary" />
                      {formatDateSafe(assignment.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {assignment.submissionsCount ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {assignment.totalGrade ?? 100} {isAr ? "درجة" : "pts"}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("assignments.show", "Show Assignment")}
                        onClick={() => handleShowAssignment(assignment)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("assignments.editTitle", "Edit Assignment")}
                        onClick={() => openAssignmentModal(assignment)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("actions.delete", "Delete")}
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingAssignment(assignment)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Add / Edit Assignment Modal ── */}
      <AddAssignmentModal />

      {/* ── Show Assignment Modal ── */}
      <AssignmentShowModal
        assignment={selectedAssignment}
        open={isShowModalOpen}
        onClose={() => {
          setIsShowModalOpen(false);
          setSelectedAssignment(null);
        }}
        onEdit={(asg) => openAssignmentModal(asg)}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog
        open={!!deletingAssignment}
        onOpenChange={(open) => !open && setDeletingAssignment(null)}
      >
        <AlertDialogContent dir={isAr ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("assignments.deleteConfirmTitle", "Delete Assignment")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "assignments.deleteConfirmDesc",
                "Are you sure you want to delete this assignment? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingAssignment(null)}>
              {t("actions.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("actions.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
