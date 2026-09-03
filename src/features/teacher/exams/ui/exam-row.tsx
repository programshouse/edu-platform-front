import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart,
  FileText,
  Eye,
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
import { ExamShowModal } from "./exam-show-modal";
import type { Exam } from "../types";

export function ExamRow({ exam }: { exam: Exam }) {
  const { t, i18n } = useTranslation("teacherExams");

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const openDeleteModal = useExamsUIStore(
    (s) => s.openDeleteModal
  );

  const { mutate: toggleStatus } = useToggleExamStatus();


  const handleToggleStatus = () => {
    toggleStatus({
      id: exam.id,
      status:
        exam.status === "active"
          ? "inactive"
          : "active",
    });
  };


  /**
   * Safe date formatter
   * Prevent Invalid time value error
   */
  const formatDate = (
    isoString?: string | null
  ) => {
    if (!isoString) {
      return "-";
    }

    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      i18n.language,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(date);
  };


  return (
  <>
    <TableRow>

      <TableCell className="font-medium">
        {exam.title}
      </TableCell>


      <TableCell>
        {exam.courseName || "-"}
      </TableCell>


      <TableCell>
        {exam.questionsCount ?? 0}
      </TableCell>


      <TableCell>
        {exam.totalGrade ?? 0}
      </TableCell>


      <TableCell>
        {exam.durationMins ?? 0}{" "}
        {t("table.mins")}
      </TableCell>


      <TableCell>
        {exam.attemptsAllowed ?? 0}
      </TableCell>


      <TableCell>
        <StatusBadge
          status={exam.status}
        />
      </TableCell>


      <TableCell>
        {formatDate(exam.createdAt)}
      </TableCell>


      <TableCell className="text-end">

        <DropdownMenu
          dir={
            i18n.language === "ar"
              ? "rtl"
              : "ltr"
          }
        >

          <DropdownMenuTrigger asChild>

            <Button
              variant="ghost"
              className="size-8 p-0"
            >

              <span className="sr-only">
                {t("actions.more")}
              </span>

              <MoreHorizontal className="size-4" />

            </Button>

          </DropdownMenuTrigger>



          <DropdownMenuContent align="end">


            <DropdownMenuItem
              onClick={() => setShowModal(true)}
            >

              <Eye className="size-4 me-2" />

              {t("actions.show", "عرض")}

            </DropdownMenuItem>


            <DropdownMenuSeparator />


            <DropdownMenuItem
              onClick={() =>
                navigate(
                  `/teacher/exams/${exam.id}/edit`
                )
              }
            >

              <Edit className="size-4 me-2" />

              {t("actions.edit")}

            </DropdownMenuItem>



            <DropdownMenuItem
              onClick={() =>
                navigate(
                  `/teacher/exams/${exam.id}/results`
                )
              }
            >

              <BarChart className="size-4 me-2" />

              {t("actions.viewResults")}

            </DropdownMenuItem>



            <DropdownMenuItem
              onClick={() =>
                navigate(
                  `/teacher/exams/${exam.id}/grading`
                )
              }
            >

              <FileText className="size-4 me-2" />

              {t("actions.grading")}

            </DropdownMenuItem>



            <DropdownMenuSeparator />



            <DropdownMenuItem
              onClick={
                handleToggleStatus
              }
            >

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
              onClick={() =>
                openDeleteModal(exam)
              }
            >

              <Trash2 className="size-4 me-2" />

              {t("actions.delete")}

            </DropdownMenuItem>


          </DropdownMenuContent>

        </DropdownMenu>

      </TableCell>

    </TableRow>

    <ExamShowModal
      examId={exam.id}
      examTitle={exam.title}
      open={showModal}
      onClose={() => setShowModal(false)}
    />
  </>
  );
}