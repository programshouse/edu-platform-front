import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { ExamStatus } from "../types";

export function StatusBadge({ status }: { status: ExamStatus }) {
  const { t } = useTranslation("teacherExams");

  if (status === "active") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-emerald-50 text-emerald-700 border-emerald-200",
          "dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
        )}
      >
        {t("status.active")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-gray-50 text-gray-700 border-gray-200",
        "dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800"
      )}
    >
      {t("status.inactive")}
    </Badge>
  );
}
