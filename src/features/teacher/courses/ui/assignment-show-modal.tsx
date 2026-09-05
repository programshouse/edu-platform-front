import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  FileText,
  Calendar,
  Users,
  Award,
  BookOpen,
  Pencil,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Assignment } from "../model/course-content-store";

interface AssignmentShowModalProps {
  assignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (assignment: Assignment) => void;
}

export function AssignmentShowModal({
  assignment,
  open,
  onClose,
  onEdit,
}: AssignmentShowModalProps) {
  const { t, i18n } = useTranslation("teacherCourses");
  const isAr = i18n.language.startsWith("ar");

  if (!assignment) return null;

  const title =
    (isAr ? assignment.title_ar : assignment.title_en) ||
    assignment.title ||
    assignment.title_en ||
    assignment.title_ar ||
    "";

  const formattedDate = (() => {
    try {
      if (!assignment.dueDate) return "-";
      const d = new Date(assignment.dueDate);
      if (isNaN(d.getTime())) return assignment.dueDate;
      return format(d, "PPP");
    } catch {
      return assignment.dueDate;
    }
  })();

  const isPastDue = (() => {
    try {
      if (!assignment.dueDate) return false;
      const d = new Date(assignment.dueDate);
      return !isNaN(d.getTime()) && d < new Date();
    } catch {
      return false;
    }
  })();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b bg-muted/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold truncate">
                  {title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {t("assignments.title", "Assignments")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isPastDue ? (
                <Badge variant="destructive" className="text-xs font-medium">
                  {isAr ? "انتهى الموعد" : "Past Due"}
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs font-medium">
                  {isAr ? "متاح للتسليم" : "Active"}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border bg-card p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{t("assignments.dueDate", "Due Date")}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>{t("assignments.submissions", "Submissions")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {assignment.submissionsCount ?? 0}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{t("assignments.grade", "Max Points")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {assignment.totalGrade ?? 100} {isAr ? "درجة" : "pts"}
              </p>
            </div>
          </div>

          {/* Instructions / Description */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>{t("assignments.instructions", "Instructions & Requirements")}</span>
            </div>
            <div className="bg-muted/20 rounded-lg p-3.5 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {assignment.description ||
                t("assignments.noInstructions", "No additional instructions provided for this assignment.")}
            </div>
          </div>

          {/* Bilingual Titles Breakdown if both provided */}
          {assignment.title_en && assignment.title_ar && (
            <div className="rounded-xl border bg-card p-4 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">English: </span>
                  <span className="font-medium text-foreground">{assignment.title_en}</span>
                </div>
                <div dir="rtl">
                  <span className="text-muted-foreground">العربية: </span>
                  <span className="font-medium text-foreground">{assignment.title_ar}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 border-t bg-muted/20 flex items-center justify-between sm:justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5">
            <X className="w-4 h-4" />
            {t("actions.close", "Close")}
          </Button>

          {onEdit && (
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(assignment);
              }}
              className="gap-1.5"
            >
              <Pencil className="w-4 h-4" />
              {t("assignments.editTitle", "Edit Assignment")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
