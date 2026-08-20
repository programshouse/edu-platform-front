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

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isFetching?: boolean;
}

export function PaginationControls({
  page,
  pageSize,
  totalPages,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  isFetching,
}: PaginationControlsProps) {
  const { t, i18n } = useTranslation("teacherExams");
  const isRtl = i18n.language === "ar";

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          {t("pagination.showing", { from: start, to: end, total })}
        </p>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground hidden sm:block">
            {t("pagination.perPage")}
          </p>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
            disabled={isFetching}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isFetching}
            aria-label={t("pagination.prev")}
          >
            <PrevIcon className="size-4" />
          </Button>
          
          <div className="flex items-center justify-center text-sm font-medium min-w-12">
            {page} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isFetching}
            aria-label={t("pagination.next")}
          >
            <NextIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
