import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api";
import type { CoursesQueryParams, CourseStatus } from "../types";

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32];
const DEFAULT_PAGE_SIZE = 8;
const DEBOUNCE_MS = 400;

// ─── URL Param Keys ───
const PARAM = {
  search: "search",
  status: "status",
  priceMin: "priceMin",
  priceMax: "priceMax",
  dateFrom: "dateFrom",
  dateTo: "dateTo",
  page: "page",
  pageSize: "pageSize",
} as const;

// ─── Hook ───
export function useCoursesQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Read from URL ──
  const filters = useMemo<CoursesQueryParams>(() => ({
    search: searchParams.get(PARAM.search) ?? "",
    status: (searchParams.get(PARAM.status) ?? "") as CourseStatus | "",
    priceMin: searchParams.get(PARAM.priceMin) ? Number(searchParams.get(PARAM.priceMin)) : "",
    priceMax: searchParams.get(PARAM.priceMax) ? Number(searchParams.get(PARAM.priceMax)) : "",
    dateFrom: searchParams.get(PARAM.dateFrom) ?? "",
    dateTo: searchParams.get(PARAM.dateTo) ?? "",
    page: Number(searchParams.get(PARAM.page) ?? 1),
    pageSize: Number(searchParams.get(PARAM.pageSize) ?? DEFAULT_PAGE_SIZE),
  }), [searchParams]);

  // ── TanStack Query ──
  const query = useQuery({
    queryKey: ["teacher", "courses", filters],
    queryFn: () => fetchCourses(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  // ── Setters ──
  const setParam = useCallback(
    (key: string, value: string | number | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === undefined || value === "" || value === 0) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
        // Reset to page 1 when filters change
        if (key !== PARAM.page && key !== PARAM.pageSize) {
          next.set(PARAM.page, "1");
        }
        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const setSearch = useCallback(
    (value: string) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setParam(PARAM.search, value);
      }, DEBOUNCE_MS);
    },
    [setParam]
  );

  const setStatus = useCallback(
    (value: string) => setParam(PARAM.status, value),
    [setParam]
  );
  const setPriceMin = useCallback(
    (value: number | "") => setParam(PARAM.priceMin, value !== "" ? value : undefined),
    [setParam]
  );
  const setPriceMax = useCallback(
    (value: number | "") => setParam(PARAM.priceMax, value !== "" ? value : undefined),
    [setParam]
  );
  const setDateFrom = useCallback(
    (value: string) => setParam(PARAM.dateFrom, value),
    [setParam]
  );
  const setDateTo = useCallback(
    (value: string) => setParam(PARAM.dateTo, value),
    [setParam]
  );
  const setPage = useCallback(
    (page: number) => setParam(PARAM.page, page),
    [setParam]
  );
  const setPageSize = useCallback(
    (size: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(PARAM.pageSize, String(size));
        next.set(PARAM.page, "1");
        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return {
    ...query,
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
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
}
