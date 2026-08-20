import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useCourseContentStore } from "../model/course-content-store";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CoursesEmptyState } from "./courses-empty-error";
import { AddAssignmentModal } from "./add-assignment-modal";
import { format } from "date-fns";

export function AssignmentsTab() {
  const { t } = useTranslation("teacherCourses");
  const assignments = useCourseContentStore((s) => s.assignments);
  const isLoading = useCourseContentStore((s) => s.isLoadingAssignments);
  const openAssignmentModal = useCourseContentStore((s) => s.openAssignmentModal);

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
              <TableHead className="w-[40%]">{t("assignments.name", "Title")}</TableHead>
              <TableHead>{t("assignments.dueDate", "Due Date")}</TableHead>
              <TableHead>{t("assignments.submissions", "Submissions")}</TableHead>
              <TableHead className="text-end">{t("actions.more", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell className="text-end"><Skeleton className="h-8 w-[60px] inline-block" /></TableCell>
                </TableRow>
              ))
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground hover:bg-transparent">
                  <CoursesEmptyState />
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="size-4" />
                      {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>{assignment.submissionsCount}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openAssignmentModal(assignment)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
      
      <AddAssignmentModal />
    </div>
  );
}
