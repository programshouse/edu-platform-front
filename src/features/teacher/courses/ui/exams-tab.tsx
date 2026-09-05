import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Eye, BarChart, FileText, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useCourseContentStore } from "../model/course-content-store";
import { fetchExams, deleteExam } from "@/features/teacher/exams/api/exams-api";
import { ExamShowModal } from "@/features/teacher/exams/ui/exam-show-modal";
import { StatusBadge } from "@/features/teacher/exams/ui/status-badge";
import { axiosInstance } from "@/shared/api";
import type { Exam } from "@/features/teacher/exams/types";

export function ExamsTab() {
  const { t, i18n } = useTranslation("teacherCourses");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const courseId = useCourseContentStore((s) => s.courseId);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);

  // ── Fetch exams for this course ──
  const { data: exams = [], isLoading } = useQuery<Exam[]>({
    queryKey: ["teacher", "course", courseId, "exams"],
    queryFn: async () => {
      if (!courseId) return [];
      try {
        const res = await fetchExams({
          course: courseId,
          page: 1,
          pageSize: 100,
          search: "",
          status: "",
          dateFrom: "",
          dateTo: "",
        });
        if (res.data && res.data.length > 0) {
          return res.data;
        }
      } catch {}

      // Fallback query to /instructor/tests directly
      try {
        const { data } = await axiosInstance.get("/instructor/tests", {
          params: { course: courseId, course_id: courseId },
        });
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const filtered = list.filter((e: any) =>
          !courseId || String(e.course_id ?? e.courseId ?? "") === String(courseId)
        );

        return filtered.map((raw: any): Exam => ({
          id: String(raw.id),
          title: raw.title ?? raw.title_en ?? raw.title_ar ?? "",
          title_en: raw.title_en ?? raw.title ?? "",
          title_ar: raw.title_ar ?? raw.title ?? "",
          courseId: String(raw.course_id ?? raw.courseId ?? courseId),
          courseName: raw.course_title ?? raw.courseName ?? "",
          questionsCount: Number(raw.questions_count ?? raw.questionsCount ?? raw.questions?.length ?? 0),
          totalGrade: Number(raw.full_mark ?? raw.totalGrade ?? 0),
          durationMins: Number(raw.duration ?? raw.durationMins ?? 0),
          attemptsAllowed: Number(raw.max_attempts ?? raw.attemptsAllowed ?? 1),
          passingGrade: raw.passing_grade != null ? Number(raw.passing_grade) : null,
          status: raw.status ?? "draft",
          questions: Array.isArray(raw.questions) ? raw.questions : [],
          settings: raw.settings ?? {
            questionOrder: "fixed",
            shuffleAnswers: false,
            timeBehavior: "start_on_attempt",
            availabilityStart: null,
            availabilityEnd: null,
            attemptsLogic: "highest",
            resultVisibility: "immediately",
            essayHandling: "wait_manual",
          },
          createdAt: raw.created_at ?? "",
          updatedAt: raw.updated_at ?? "",
        }));
      } catch {
        return [];
      }
    },
    enabled: !!courseId,
  });

  // ── Delete mutation ──
  const { mutate: removeExam, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "course", courseId, "exams"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "exams"] });
      toast.success(t("exams.deleted", "Exam deleted successfully"));
      setDeletingExam(null);
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? t("notifications.error", "Something went wrong"));
    },
  });

  const handleCreateExam = () => {
    navigate(courseId ? `/teacher/exams/create?courseId=${courseId}` : "/teacher/exams/create");
  };

  const handleShowExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsShowModalOpen(true);
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
              <TableHead className="w-[35%]">{t("exams.name", "Title")}</TableHead>
              <TableHead>{t("exams.questions", "Questions")}</TableHead>
              <TableHead>{t("exams.duration", "Duration")}</TableHead>
              <TableHead>{t("exams.grade", "Total Grade")}</TableHead>
              <TableHead>{t("exams.status", "Status")}</TableHead>
              <TableHead className="text-end">{t("exams.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[70px] rounded-full" /></TableCell>
                  <TableCell className="text-end"><Skeleton className="h-8 w-[120px] inline-block" /></TableCell>
                </TableRow>
              ))
            ) : exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground hover:bg-transparent">
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-sm">
                        {t("exams.noExams", "No exams in this course yet")}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {t("exams.noExamsHint", "Create an exam to assess student knowledge for this course.")}
                      </p>
                    </div>
                    <Button onClick={handleCreateExam} size="sm" variant="outline" className="mt-1">
                      <Plus className="size-4 me-1.5" />
                      {t("exams.add", "Create Exam")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.questionsCount}</TableCell>
                  <TableCell>
                    {exam.durationMins} {t("card.minutes", "mins")}
                  </TableCell>
                  <TableCell>{exam.totalGrade}</TableCell>
                  <TableCell>
                    <StatusBadge status={exam.status} />
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("exams.show", "Show Exam")}
                        onClick={() => handleShowExam(exam)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("exams.edit", "Edit Exam")}
                        onClick={() => navigate(`/teacher/exams/${exam.id}/edit`)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("exams.results", "Exam Results")}
                        onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
                      >
                        <BarChart className="size-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("exams.grading", "Grading")}
                        onClick={() => navigate(`/teacher/exams/${exam.id}/grading`)}
                      >
                        <FileText className="size-4 text-emerald-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("exams.delete", "Delete")}
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingExam(exam)}
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

      {/* ── Exam Show Modal ── */}
      {selectedExam && (
        <ExamShowModal
          examId={selectedExam.id}
          examTitle={selectedExam.title}
          open={isShowModalOpen}
          onClose={() => {
            setIsShowModalOpen(false);
            setSelectedExam(null);
          }}
        />
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog
        open={!!deletingExam}
        onOpenChange={(open) => !open && setDeletingExam(null)}
      >
        <AlertDialogContent dir={i18n.language.startsWith("ar") ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("exams.deleteConfirmTitle", "Delete Exam")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "exams.deleteConfirmDesc",
                "Are you sure you want to delete this exam? All student submissions and grading records will be permanently removed."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("actions.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingExam && removeExam(deletingExam.id)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("form.submitting", "Deleting...") : t("actions.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
