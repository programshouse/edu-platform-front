import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Clock,
  DollarSign,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  ImageOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { CourseStatusBadge } from "./course-status-badge";
import { useCoursesUIStore } from "../model/courses-ui-store";
import { useToggleCourseStatus } from "../hooks/use-toggle-course-status";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { t, i18n } = useTranslation("teacherCourses");
  const navigate = useNavigate();
  const openEditModal = useCoursesUIStore((s) => s.openEditModal);
  const openDeleteModal = useCoursesUIStore((s) => s.openDeleteModal);
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCourseStatus();

  const isActive = course.status === "active";
  const isFinished = course.status === "finished";

  const handleToggleStatus = () => {
    if (isFinished) return;
    toggleStatus({
      id: course.id,
      status: isActive ? "inactive" : "active",
    });
  };

  const formattedPrice =
    course.price === 0
      ? t("card.free")
      : new Intl.NumberFormat(i18n.language === "ar" ? "ar-EG" : "en-US", {
          style: "currency",
          currency: "EGP",
          maximumFractionDigits: 0,
        }).format(course.price);

  return (
    <article
      onClick={() => navigate(`/teacher/courses/${course.id}`)}
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden",
        "shadow-sm hover:shadow-md transition-shadow duration-200"
      )}
    >
      {/* ── Cover Image ── */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
            <ImageOff className="size-10 text-blue-200" />
          </div>
        )}

        {/* Status badge overlay */}
        <div className="absolute top-2 inset-s-2">
          <CourseStatusBadge status={course.status} />
        </div>

        {/* Actions menu overlay */}
        <div className="absolute top-2 inset-e-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CourseActionsMenu
            course={course}
            onEdit={() => openEditModal(course)}
            onDelete={() => openDeleteModal(course)}
            onToggleStatus={handleToggleStatus}
            onViewContent={() => navigate(`/teacher/courses/${course.id}`)}
            isTogglingStatus={isTogglingStatus}
            isFinished={isFinished}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm text-card-foreground leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <StatChip icon={DollarSign} value={formattedPrice} />
          <StatChip
            icon={Clock}
            value={`${course.accessDurationDays} ${t("card.days")}`}
          />
          <StatChip
            icon={BookOpen}
            value={`${course.lecturesCount} ${t("card.lectures")}`}
          />
          <StatChip
            icon={Users}
            value={`${course.enrolledStudentsCount} ${t("card.students")}`}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        {/* Toggle status button */}
        <button
          onClick={handleToggleStatus}
          disabled={isFinished || isTogglingStatus}
          aria-label={isActive ? t("actions.deactivate") : t("actions.activate")}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            isFinished
              ? "text-muted-foreground cursor-not-allowed"
              : isActive
              ? "text-emerald-600 hover:text-emerald-700"
              : "text-amber-600 hover:text-amber-700"
          )}
        >
          {isActive ? (
            <ToggleRight className="size-4" />
          ) : (
            <ToggleLeft className="size-4" />
          )}
          {isActive ? t("actions.deactivate") : t("actions.activate")}
        </button>

        {/* Quick actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={() => openEditModal(course)}
            aria-label={t("actions.edit")}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => openDeleteModal(course)}
            aria-label={t("actions.delete")}
          >
            <Trash2 className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-blue-600"
            onClick={() => navigate(`/teacher/courses/${course.id}`)}
            aria-label={t("actions.viewContent")}
          >
            <Eye className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Stat Chip ───
function StatChip({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 shrink-0 text-blue-400" />
      <span className="truncate">{value}</span>
    </div>
  );
}

// ─── Actions Menu ───
interface CourseActionsMenuProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onViewContent: () => void;
  isTogglingStatus: boolean;
  isFinished: boolean;
}

function CourseActionsMenu({
  onEdit,
  onDelete,
  onToggleStatus,
  onViewContent,
  isTogglingStatus,
  isFinished,
}: CourseActionsMenuProps) {
  const { t } = useTranslation("teacherCourses");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-8 bg-white/90 hover:bg-white shadow-sm"
        >
          <MoreVertical className="size-4" />
          <span className="sr-only">{t("actions.more")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onViewContent}>
          <Eye className="size-4 me-2" />
          {t("actions.viewContent")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4 me-2" />
          {t("actions.edit")}
        </DropdownMenuItem>
        {!isFinished && (
          <DropdownMenuItem onClick={onToggleStatus} disabled={isTogglingStatus}>
            <ToggleLeft className="size-4 me-2" />
            {t("actions.toggleStatus")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="size-4 me-2" />
          {t("actions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
