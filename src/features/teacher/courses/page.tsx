import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TeacherPageLayout } from "../components/teacher-page-layout";
import { CoursesFilters } from "./ui/courses-filters";
import { CourseCard } from "./ui/course-card";
import { CoursesPagination } from "./ui/courses-pagination";
import { CoursesGridSkeleton } from "./ui/courses-skeleton";
import { CoursesEmptyState, CoursesErrorState } from "./ui/courses-empty-error";
import { CreateCourseDialog } from "./ui/create-course-dialog";
import { EditCourseDialog } from "./ui/edit-course-dialog";
import { DeleteCourseDialog } from "./ui/delete-course-dialog";
import { useCoursesQuery } from "./hooks/use-courses-query";
import { useCoursesUIStore } from "./model/courses-ui-store";

export function TeacherCoursesPage() {
  const { t } = useTranslation("teacherCourses");
  const openCreateModal = useCoursesUIStore((s) => s.openCreateModal);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    filters,
    setSearch,
    setStatus,
    setPriceMin,
    setPriceMax,
    setDateFrom,
    setDateTo,
    setPage,
    setPageSize,
    resetFilters,
    pageSizeOptions,
  } = useCoursesQuery();

  const courses = data?.data ?? [];
  const meta = data?.meta;

  const hasActiveFilters = !!(
    filters.search ||
    filters.status ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
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
          id="add-course-btn"
          onClick={openCreateModal}
          size="sm"
        >
          <Plus className="size-4 me-1.5" />
          {t("actions.addCourse")}
        </Button>
      }
    >
        {/* ── Page Content ── */}
        <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl flex flex-col gap-6">
            {/* ── Filters ── */}
            <section aria-label={t("filters.sectionLabel")}>
              <CoursesFilters
                filters={filters}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
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
            <section aria-label={t("coursesList")} aria-busy={isLoading}>
              {isLoading ? (
                <CoursesGridSkeleton count={filters.pageSize} />
              ) : isError ? (
                <CoursesErrorState
                  message={(error as { message?: string })?.message}
                  onRetry={() => refetch()}
                />
              ) : courses.length === 0 ? (
                <CoursesEmptyState
                  hasFilters={hasActiveFilters}
                  onReset={resetFilters}
                />
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  role="list"
                  aria-label={t("coursesList")}
                >
                  {courses.map((course) => (
                    <div key={course.id} role="listitem">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Pagination ── */}
            {meta && meta.totalPages > 1 && (
              <CoursesPagination
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
      <CreateCourseDialog />
      <EditCourseDialog />
      <DeleteCourseDialog />
    </>
  );
}
