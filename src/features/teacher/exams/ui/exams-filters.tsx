import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

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

import { useCoursesQuery } from "@/features/teacher/courses/hooks/use-courses-query";

import type { ExamsQueryParams } from "../types";


interface ExamsFiltersProps {
  filters: ExamsQueryParams;
  onSearchChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
  isFetching?: boolean;
}


export function ExamsFilters({
  filters,
  onSearchChange,
  onCourseChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onReset,
  isFetching,
}: ExamsFiltersProps) {

  const { t } = useTranslation("teacherExams");

  const searchInputRef =
    useRef<HTMLInputElement>(null);


  const {
    data,
    isLoading,
  } = useCoursesQuery();


  const courses = data?.data ?? [];



  const hasActiveFilters =
    filters.search ||
    filters.course ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo;



  const handleSearchClear = () => {

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    onSearchChange("");

  };



  return (

    <div className="flex flex-col gap-3">


      <div className="flex flex-col sm:flex-row gap-3">


        {/* Search */}
        <div className="relative flex-1 min-w-0">

          <Search
            className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />


          <Input

            ref={searchInputRef}

            id="exams-search"

            className="ps-9 pe-9"

            placeholder={
              t("filters.searchPlaceholder")
            }

            defaultValue={filters.search}

            onChange={(e) =>
              onSearchChange(e.target.value)
            }

          />


          {filters.search && (

            <button

              onClick={handleSearchClear}

              className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"

            >

              <X className="size-4" />

            </button>

          )}

        </div>




        {/* Course Filter */}
        <Select

          value={filters.course || "all"}

          onValueChange={(v) =>
            onCourseChange(
              v === "all" ? "" : v
            )
          }

        >

          <SelectTrigger className="w-full sm:w-48">

            <SelectValue
              placeholder={
                t("filters.allCourses")
              }
            />

          </SelectTrigger>


          <SelectContent>


            <SelectItem value="all">

              {t("filters.allCourses")}

            </SelectItem>



            {isLoading && (

              <SelectItem
                value="loading"
                disabled
              >

                Loading courses...

              </SelectItem>

            )}



            {!isLoading &&
              courses.length === 0 && (

              <SelectItem
                value="empty"
                disabled
              >

                No courses found

              </SelectItem>

            )}



            {courses.map((course: any) => (

              <SelectItem

                key={course.id}

                value={String(course.id)}

              >

                {
                  course.title_en ??
                  course.title ??
                  course.name
                }

              </SelectItem>

            ))}


          </SelectContent>


        </Select>





        {/* Status */}
        <Select

          value={filters.status || "all"}

          onValueChange={(v) =>
            onStatusChange(
              v === "all" ? "" : v
            )
          }

        >

          <SelectTrigger className="w-full sm:w-40">

            <SelectValue
              placeholder={
                t("filters.allStatuses")
              }
            />

          </SelectTrigger>



          <SelectContent>


            <SelectItem value="all">

              {t("filters.allStatuses")}

            </SelectItem>


            <SelectItem value="active">

              {t("status.active")}

            </SelectItem>


            <SelectItem value="inactive">

              {t("status.inactive")}

            </SelectItem>


          </SelectContent>


        </Select>


      </div>





      <div className="flex flex-wrap items-center gap-2">


        <Input

          type="date"

          className="w-36 h-8 text-sm"

          value={filters.dateFrom}

          onChange={(e) =>
            onDateFromChange(
              e.target.value
            )
          }

        />


        <span className="text-muted-foreground text-sm">
          →
        </span>


        <Input

          type="date"

          className="w-36 h-8 text-sm"

          value={filters.dateTo}

          onChange={(e) =>
            onDateToChange(
              e.target.value
            )
          }

        />



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




        {isFetching && (

          <div

            className={cn(
              "ms-auto size-4 rounded-full border-2 border-blue-600 border-t-transparent",
              "animate-spin"
            )}

          />

        )}


      </div>


    </div>

  );
}