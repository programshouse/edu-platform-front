import { useTranslation } from "react-i18next";
import { BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

// ─── Empty State ───
interface CoursesEmptyStateProps {
  hasFilters?: boolean;
  onReset?: () => void;
}

export function CoursesEmptyState({ hasFilters, onReset }: CoursesEmptyStateProps) {
  const { t } = useTranslation("teacherCourses");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="size-9 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">
          {hasFilters ? t("empty.noResults") : t("empty.noCourses")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {hasFilters ? t("empty.noResultsHint") : t("empty.noCoursesHint")}
        </p>
      </div>
      {hasFilters && onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="size-3.5 me-2" />
          {t("filters.reset")}
        </Button>
      )}
    </div>
  );
}

// ─── Error State ───
interface CoursesErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function CoursesErrorState({ message, onRetry }: CoursesErrorStateProps) {
  const { t } = useTranslation("teacherCourses");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="size-9 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">{t("error.title")}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {message ?? t("error.generic")}
        </p>
      </div>
      {onRetry && (
        <Button variant="default" size="sm" onClick={onRetry}>
          <RefreshCw className="size-3.5 me-2" />
          {t("error.retry")}
        </Button>
      )}
    </div>
  );
}
