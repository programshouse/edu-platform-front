import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchExams } from "../api";
import type { ExamsQueryParams, ExamStatus } from "../types";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

const PARAM = {
  search: "search",
  course: "course",
  status: "status",
  dateFrom: "dateFrom",
  dateTo: "dateTo",
  page: "page",
  pageSize: "pageSize",
} as const;

export function useExamsQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const filters = useMemo<ExamsQueryParams>(() => ({
    search: searchParams.get(PARAM.search) ?? "",
    course: searchParams.get(PARAM.course) ?? "",
    status: (searchParams.get(PARAM.status) ?? "") as ExamStatus | "",
    dateFrom: searchParams.get(PARAM.dateFrom) ?? "",
    dateTo: searchParams.get(PARAM.dateTo) ?? "",
    page: Number(searchParams.get(PARAM.page) ?? 1),
    pageSize: Number(searchParams.get(PARAM.pageSize) ?? DEFAULT_PAGE_SIZE),
  }), [searchParams]);

  const query = useQuery({
    queryKey: ["teacher", "exams", filters],
    queryFn: () => fetchExams(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  const setParam = useCallback(
    (key: string, value: string | number | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === undefined || value === "" || value === 0) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
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

  const setCourse = useCallback(
    (value: string) => setParam(PARAM.course, value),
    [setParam]
  );
  const setStatus = useCallback(
    (value: string) => setParam(PARAM.status, value),
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

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return {
    ...query,
    filters,
    setSearch,
    setCourse,
    setStatus,
    setDateFrom,
    setDateTo,
    setPage,
    setPageSize,
    resetFilters,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
}
