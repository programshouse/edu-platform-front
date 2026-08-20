import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { TeacherPageLayout } from "../components/teacher-page-layout";
import { ExamsFilters } from "./ui/exams-filters";
import { ExamsTable } from "./ui/exams-table";
import { ExamsTableSkeleton } from "./ui/exams-table-skeleton";
import { ExamsEmptyState, ExamsErrorState } from "./ui/exams-empty-error";
import { PaginationControls } from "./ui/pagination-controls";
import { ConfirmDeleteDialog } from "./ui/confirm-delete-dialog";
import { useExamsQuery } from "./hooks/use-exams-query";

export function TeacherExamsPage() {
  const { t } = useTranslation("teacherExams");
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    filters,
    setSearch,
    setCourse,
    setStatus,
    setDateFrom,
    setDateTo,
    setPage,
    setPageSize,
    resetFilters,
    pageSizeOptions,
  } = useExamsQuery();

  const exams = data?.data ?? [];
  const meta = data?.meta;

  const hasActiveFilters = !!(
    filters.search ||
    filters.course ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo
  );

  return (
    <>
    <TeacherPageLayout
      title={t("pageTitle")}
      subtitle={t("pageSubtitle")}
      headerActions={
        <Button
          onClick={() => navigate("/teacher/exams/create")}
          size="sm"
        >
          <Plus className="size-4 me-1.5" />
          {t("actions.createExam")}
        </Button>
      }
    >
        {/* ── Page Content ── */}
        <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl flex flex-col gap-6">
            {/* ── Filters ── */}
            <section aria-label={t("filters.sectionLabel")}>
              <ExamsFilters
                filters={filters}
                onSearchChange={setSearch}
                onCourseChange={setCourse}
                onStatusChange={setStatus}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onReset={resetFilters}
                isFetching={isFetching && !isLoading}
              />
            </section>

            {/* ── Results Summary ── */}
            {!isLoading && meta && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("resultsCount", { count: meta.total })}
                </p>
              </div>
            )}

            {/* ── Content Area ── */}
            <section aria-label={t("examsList")} aria-busy={isLoading}>
              {isLoading ? (
                <ExamsTableSkeleton count={filters.pageSize} />
              ) : isError ? (
                <ExamsErrorState
                  message={(error as { message?: string })?.message}
                  onRetry={() => refetch()}
                />
              ) : exams.length === 0 ? (
                <ExamsEmptyState
                  hasFilters={hasActiveFilters}
                  onReset={resetFilters}
                />
              ) : (
                <ExamsTable exams={exams} />
              )}
            </section>

            {/* ── Pagination ── */}
            {meta && meta.totalPages > 1 && (
              <PaginationControls
                page={filters.page}
                pageSize={filters.pageSize}
                totalPages={meta.totalPages}
                total={meta.total}
                pageSizeOptions={pageSizeOptions}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                isFetching={isFetching}
              />
            )}
          </div>
        </main>
    </TeacherPageLayout>

      {/* ── Modals (portal-rendered) ── */}
      <ConfirmDeleteDialog />
    </>
  );
}
