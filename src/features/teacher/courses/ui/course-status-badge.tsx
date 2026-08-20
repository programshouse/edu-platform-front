import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { CourseStatus } from "../types/index";

interface CourseStatusBadgeProps {
  status: CourseStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  CourseStatus,
  { variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  active: {
    variant: "default",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  inactive: {
    variant: "secondary",
    className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  finished: {
    variant: "outline",
    className: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100",
  },
};

export function CourseStatusBadge({ status, className }: CourseStatusBadgeProps) {
  const { t } = useTranslation("teacherCourses");
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs font-medium border", config.className, className)}
    >
      {t(`status.${status}`)}
    </Badge>
  );
}
