import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import type { CoursesQueryParams } from "../types";

interface CoursesFiltersProps {
  filters: CoursesQueryParams;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriceMinChange: (value: number | "") => void;
  onPriceMaxChange: (value: number | "") => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
  isFetching?: boolean;
}

export function CoursesFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onPriceMinChange,
  onPriceMaxChange,
  onDateFromChange,
  onDateToChange,
  onReset,
  isFetching,
}: CoursesFiltersProps) {
  const { t } = useTranslation("teacherCourses");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.dateFrom ||
    filters.dateTo;

  const handleSearchClear = () => {
    if (searchInputRef.current) searchInputRef.current.value = "";
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Row 1: Search + Status ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            id="courses-search"
            className="ps-9 pe-9"
            placeholder={t("filters.searchPlaceholder")}
            defaultValue={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t("filters.searchPlaceholder")}
          />
          {filters.search && (
            <button
              onClick={handleSearchClear}
              className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t("filters.clearSearch")}
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}
        >
          <SelectTrigger id="courses-status-filter" className="w-full sm:w-40">
            <SelectValue placeholder={t("filters.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
            <SelectItem value="active">{t("status.active")}</SelectItem>
            <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
            <SelectItem value="finished">{t("status.finished")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Row 2: Price range + Date range + Reset ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {t("filters.priceRange")}:
          </span>
        </div>

        {/* Price min */}
        <Input
          id="courses-price-min"
          type="number"
          min={0}
          className="w-36 h-8 text-sm"
          placeholder={t("filters.min")}
          value={filters.priceMin !== "" ? filters.priceMin : ""}
          onChange={(e) =>
            onPriceMinChange(e.target.value !== "" ? Number(e.target.value) : "")
          }
          aria-label={t("filters.minPrice")}
        />
        <span className="text-muted-foreground text-sm">–</span>
        {/* Price max */}
        <Input
          id="courses-price-max"
          type="number"
          min={0}
          className="w-36 h-8 text-sm"
          placeholder={t("filters.max")}
          value={filters.priceMax !== "" ? filters.priceMax : ""}
          onChange={(e) =>
            onPriceMaxChange(e.target.value !== "" ? Number(e.target.value) : "")
          }
          aria-label={t("filters.maxPrice")}
        />

        {/* Date range */}
        <span className="text-muted-foreground text-xs mx-1">|</span>
        <Input
          id="courses-date-from"
          type="date"
          className="w-36 h-8 text-sm"
          value={filters.dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          aria-label={t("filters.dateFrom")}
        />
        <span className="text-muted-foreground text-sm">→</span>
        <Input
          id="courses-date-to"
          type="date"
          className="w-36 h-8 text-sm"
          value={filters.dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          aria-label={t("filters.dateTo")}
        />

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5 me-1" />
            {t("filters.reset")}
          </Button>
        )}

        {/* Fetching indicator */}
        {isFetching && (
          <div
            className={cn(
              "ms-auto size-4 rounded-full border-2 border-blue-600 border-t-transparent",
              "animate-spin"
            )}
            aria-label={t("loading")}
          />
        )}
      </div>
    </div>
  );
}
