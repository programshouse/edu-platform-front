import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { toast } from "sonner";

export function ExamsTab() {
  const { t } = useTranslation("teacherCourses");
  const exams = useCourseContentStore((s) => s.exams);
  const isLoading = useCourseContentStore((s) => s.isLoadingExams);

  const handleCreateExam = () => {
    toast.info(t("exams.builderNotice", "Exam builder page coming soon"));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("exams.title", "Exams")}</h3>
        <Button onClick={handleCreateExam} size="sm">
          <Plus className="size-4 me-2" />
          {t("exams.add", "Create Exam")}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">{t("exams.name", "Title")}</TableHead>
              <TableHead>{t("exams.questions", "Questions")}</TableHead>
              <TableHead>{t("exams.duration", "Duration")}</TableHead>
              <TableHead>{t("exams.grade", "Total Grade")}</TableHead>
              <TableHead className="text-end">{t("actions.more", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell className="text-end"><Skeleton className="h-8 w-[60px] inline-block" /></TableCell>
                </TableRow>
              ))
            ) : exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <CoursesEmptyState />
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.questionsCount}</TableCell>
                  <TableCell>{exam.durationMinutes} {t("card.minutes", "mins")}</TableCell>
                  <TableCell>{exam.totalGrade}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Edit exam coming soon")}>
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
    </div>
  );
}
