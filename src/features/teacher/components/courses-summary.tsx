import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ExternalLinkIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type CourseStatus = "active" | "inactive" | "expired";

interface Course {
  id: string;
  title: string;
  students: number;
  earnings: number;
  status: CourseStatus;
}

const MOCK_COURSES: Course[] = [
  { id: "1", title: "React من الصفر إلى الاحتراف",    students: 340, earnings: 12200, status: "active" },
  { id: "2", title: "تصميم واجهات المستخدم بـ Figma",  students: 215, earnings: 8600,  status: "active" },
  { id: "3", title: "JavaScript المتقدم",               students: 180, earnings: 7200,  status: "inactive" },
  { id: "4", title: "Python للمبتدئين",                 students: 420, earnings: 15400, status: "active" },
  { id: "5", title: "CSS & Tailwind Masterclass",       students: 129, earnings: 4950,  status: "expired" },
];

const STATUS_STYLE: Record<CourseStatus, string> = {
  active:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  inactive: "bg-gray-50 text-gray-600 border border-gray-200",
  expired:  "bg-red-50 text-red-600 border border-red-200",
};

export function CoursesSummary() {
  const { t } = useTranslation("teacher");

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">{t("courses.title")}</h2>
        <Link
          to="/teacher/courses"
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("courses.viewAll")}
          <ExternalLinkIcon className="size-3" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>{t("courses.columns.course")}</span>
          <span className="text-center">{t("courses.columns.students")}</span>
          <span className="hidden sm:block text-center">{t("courses.columns.earnings")}</span>
          <span className="text-center">{t("courses.columns.status")}</span>
          <span>{t("courses.columns.actions")}</span>
        </div>

        {/* Rows */}
        {MOCK_COURSES.map((course, idx) => (
          <div
            key={course.id}
            className={cn(
              "grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3.5 text-sm hover:bg-blue-50/40 transition-colors",
              idx < MOCK_COURSES.length - 1 && "border-b border-gray-50"
            )}
          >
            <span className="font-medium text-gray-800 truncate">{course.title}</span>
            <span className="text-center text-gray-500 tabular-nums">{course.students.toLocaleString()}</span>
            <span className="hidden sm:block text-center text-gray-500 tabular-nums">
              {course.earnings.toLocaleString()} {t("stats.currency")}
            </span>
            <span className="flex justify-center">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STATUS_STYLE[course.status])}>
                {t(`courses.status.${course.status}`)}
              </span>
            </span>
            <Link
              to={`/teacher/courses/${course.id}`}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {t("courses.manage")}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
