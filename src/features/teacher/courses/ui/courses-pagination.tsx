import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

interface CoursesPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isFetching?: boolean;
}

export function CoursesPagination({
  page,
  pageSize,
  totalPages,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  isFetching,
}: CoursesPaginationProps) {
  const { t, i18n } = useTranslation("teacherCourses");
  const isRTL = i18n.dir() === "rtl";

  // Generate page numbers to show
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      {/* Results summary */}
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        {t("pagination.showing", {
          from: Math.min((page - 1) * pageSize + 1, total),
          to: Math.min(page * pageSize, total),
          total,
        })}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
          aria-label={t("pagination.prev")}
          id="courses-page-prev"
        >
          <PrevIcon className="size-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-sm">
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                size="icon"
                className={cn(
                  "size-9 text-sm",
                  page === p && "pointer-events-none"
                )}
                onClick={() => onPageChange(p as number)}
                disabled={isFetching}
                aria-label={t("pagination.goTo", { page: p })}
                aria-current={page === p ? "page" : undefined}
                id={`courses-page-${p}`}
              >
                {p}
              </Button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isFetching}
          aria-label={t("pagination.next")}
          id="courses-page-next"
        >
          <NextIcon className="size-4" />
        </Button>
      </div>

      {/* Page size */}
      <div className="flex items-center gap-2 order-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {t("pagination.perPage")}
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger id="courses-page-size" className="h-9 w-20 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
