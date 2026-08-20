import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Users,
  ImageOff,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CourseStatusBadge } from "./course-status-badge";
import { CourseInfoItem } from "./course-info-item";
import type { Course } from "../types";

interface CourseOverviewCardProps {
  course: Course | null;
  isLoading: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function CourseOverviewCard({
  course,
  isLoading,
  onEdit,
  onToggleStatus,
}: CourseOverviewCardProps) {
  const { t, i18n } = useTranslation("teacherCourses");

  if (isLoading || !course) {
    return <CourseOverviewCardSkeleton />;
  }

  const isFinished = course.status === "finished";
  const isActive = course.status === "active";

  const formattedPrice =
    course.price === 0
      ? t("card.free")
      : new Intl.NumberFormat(i18n.language === "ar" ? "ar-EG" : "en-US", {
          style: "currency",
          currency: "EGP",
          maximumFractionDigits: 0,
        }).format(course.price);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <div className="grid md:grid-cols-3 md:gap-6">
        {/* Cover Image */}
        <div className="relative h-56 w-full md:h-full md:min-h-[250px] bg-muted/50 border-b md:border-b-0 md:border-e border-border">
          {course.coverImage ? (
            <img
              src={course.coverImage}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageOff className="size-10 opacity-20" />
            </div>
          )}
          <div className="absolute top-4 inset-s-4">
            <CourseStatusBadge status={course.status} className="shadow-xs backdrop-blur-md bg-background/80" />
          </div>
        </div>

        {/* Content */}
        <CardContent className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {course.title}
              </h1>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="hidden sm:flex"
                >
                  <Pencil className="size-4 me-2" />
                  {t("overview.editCourse", "Edit Course")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={onEdit}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
            <CourseInfoItem
              icon={DollarSign}
              label={t("overview.price", "Price")}
              value={formattedPrice}
            />
            <CourseInfoItem
              icon={Clock}
              label={t("overview.duration", "Duration")}
              value={`${course.durationDays} ${t("card.days")}`}
            />
            <CourseInfoItem
              icon={Users}
              label={t("overview.students", "Enrolled Students")}
              value={course.enrolledStudentsCount.toString()}
            />
            <CourseInfoItem
              icon={CalendarDays}
              label={t("overview.startDate", "Start Date")}
              value={formatDate(course.startDate)}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{t("overview.status", "Course Status")}</span>
                {isFinished && (
                  <span className="text-xs text-muted-foreground">{t("status.finished")}</span>
                )}
              </div>
              <Switch
                checked={isActive}
                disabled={isFinished}
                onCheckedChange={onToggleStatus}
              />
            </div>
            
            <div className="text-sm text-muted-foreground flex gap-4">
               {/* Additional stats could go here */}
               <span>{course.lecturesCount} {t("overview.lectures", "Lectures")}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function CourseOverviewCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <div className="grid md:grid-cols-3 md:gap-6">
        <Skeleton className="h-56 w-full md:h-full md:min-h-[250px] rounded-none" />
        <CardContent className="md:col-span-2 p-6 flex flex-col gap-6">
          <div className="flex justify-between gap-4">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-3/4 max-w-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-9 w-24 shrink-0" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>

          <div className="mt-2 pt-6 border-t border-border flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
