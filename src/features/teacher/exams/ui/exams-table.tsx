import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ExamRow } from "./exam-row";
import type { Exam } from "../types";

export function ExamsTable({ exams }: { exams: Exam[] }) {
  const { t } = useTranslation("teacherExams");

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.course")}</TableHead>
            <TableHead>{t("table.questions")}</TableHead>
            <TableHead>{t("table.grade")}</TableHead>
            <TableHead>{t("table.duration")}</TableHead>
            <TableHead>{t("table.attempts")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.created")}</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <ExamRow key={exam.id} exam={exam} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
