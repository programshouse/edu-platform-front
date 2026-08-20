import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { useExamsUIStore } from "../model/exams-ui-store";
import { useToggleExamStatus } from "../hooks/use-toggle-exam-status";
import { StatusBadge } from "./status-badge";
import type { Exam } from "../types";

export function ExamRow({ exam }: { exam: Exam }) {
  const { t, i18n } = useTranslation("teacherExams");
  const navigate = useNavigate();
  const openDeleteModal = useExamsUIStore((s) => s.openDeleteModal);
  const { mutate: toggleStatus } = useToggleExamStatus();

  const handleToggleStatus = () => {
    toggleStatus({
      id: exam.id,
      status: exam.status === "active" ? "inactive" : "active",
    });
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(isoString));
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{exam.title}</TableCell>
      <TableCell>{exam.courseName}</TableCell>
      <TableCell>{exam.questionsCount}</TableCell>
      <TableCell>{exam.totalGrade}</TableCell>
      <TableCell>{exam.durationMins} {t("table.mins")}</TableCell>
      <TableCell>{exam.attemptsAllowed}</TableCell>
      <TableCell>
        <StatusBadge status={exam.status} />
      </TableCell>
      <TableCell>{formatDate(exam.createdAt)}</TableCell>
      <TableCell className="text-end">
        <DropdownMenu dir={i18n.language === "ar" ? "rtl" : "ltr"}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">{t("actions.more")}</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/teacher/exams/${exam.id}/edit`)}>
              <Edit className="size-4 me-2" />
              {t("actions.edit")}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}>
              <BarChart className="size-4 me-2" />
              {t("actions.viewResults")}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate(`/teacher/exams/${exam.id}/grading`)}>
              <FileText className="size-4 me-2" />
              {t("actions.grading")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleToggleStatus}>
              {exam.status === "active" ? (
                <>
                  <Pause className="size-4 me-2" />
                  {t("actions.deactivate")}
                </>
              ) : (
                <>
                  <Play className="size-4 me-2" />
                  {t("actions.activate")}
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => openDeleteModal(exam)}
            >
              <Trash2 className="size-4 me-2" />
              {t("actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
