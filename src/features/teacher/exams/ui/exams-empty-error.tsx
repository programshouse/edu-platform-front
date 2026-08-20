import { useTranslation } from "react-i18next";
import { AlertCircle, FileSearch, GraduationCap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function ExamsEmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset?: () => void;
}) {
  const { t } = useTranslation("teacherExams");

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-border">
        <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <FileSearch className="size-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{t("empty.noResults")}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {t("empty.noResultsHint")}
        </p>
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            {t("filters.reset")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-xl border border-border">
      <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-6 shadow-sm">
        <GraduationCap className="size-8 text-blue-600 dark:text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{t("empty.noExams")}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        {t("empty.noExamsHint")}
      </p>
      {/* You can add a button to navigate to create here, but it's also in the header */}
    </div>
  );
}

export function ExamsErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  const { t } = useTranslation("teacherExams");

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-destructive/20 bg-destructive/5">
      <AlertCircle className="size-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-destructive mb-2">
        {t("error.title")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {message || t("error.generic")}
      </p>
      <Button variant="outline" onClick={onRetry}>
        {t("error.retry")}
      </Button>
    </div>
  );
}
