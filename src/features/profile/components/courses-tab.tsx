import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, BookOpen, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  image: string;
  progress: number;
  status: "active" | "expired";
  expiresAt: string;
}

interface CoursesTabProps {
  courses: EnrolledCourse[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function CoursesTab({ courses }: CoursesTabProps) {
  const { t } = useTranslation("profile");

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">{t("courses.noCourses")}</p>
        <p className="text-sm text-gray-400 mt-1">{t("courses.noCoursesDesc")}</p>
        <Link
          to="/courses"
          className="mt-6 px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          {t("courses.viewDetails")}
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      {courses.map((course) => {
        const isActive = course.status === "active";
        return (
          <motion.div
            key={course.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
          >
            {/* Course Image */}
            <div className="relative h-40 overflow-hidden shrink-0">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {/* Status Badge */}
              <div
                className={cn(
                  "absolute top-3 inset-e-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm",
                  isActive
                    ? "bg-emerald-500/90 text-white"
                    : "bg-red-500/90 text-white"
                )}
              >
                {isActive ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {isActive ? t("courses.status.active") : t("courses.status.expired")}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">{course.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description}</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-500">{t("courses.progress")}</span>
                  <span className="text-xs font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className={cn(
                      "h-full rounded-full",
                      course.progress >= 80
                        ? "bg-linear-to-r from-emerald-500 to-green-400"
                        : course.progress >= 40
                        ? "bg-linear-to-r from-blue-500 to-blue-400"
                        : "bg-linear-to-r from-amber-500 to-orange-400"
                    )}
                  />
                </div>
              </div>

              {/* Expiry */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                {t("courses.expires")}: {course.expiresAt}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-1">
                <Link
                  to={`/courses/${course.id}`}
                  id={`courses-tab-access-${course.id}`}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-200",
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                  )}
                >
                  {t("courses.accessCourse")}
                </Link>
                <Link
                  to={`/courses/${course.id}`}
                  id={`courses-tab-details-${course.id}`}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t("courses.viewDetails")}
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
