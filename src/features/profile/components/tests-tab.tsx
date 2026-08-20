import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ClipboardList, RefreshCw, Eye, CheckCircle, XCircle, Loader } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StudentTest {
  id: number;
  title: string;
  courseName: string;
  courseId: number;
  lectureIndex: number;
  grade: number | null;
  totalScore: number;
  status: "passed" | "failed" | "inProgress";
  attempts: number;
  maxAttempts: number;
}

interface TestsTabProps {
  tests: StudentTest[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const statusConfig = {
  passed: {
    icon: CheckCircle,
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconClass: "text-emerald-500",
  },
  failed: {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-100",
    iconClass: "text-red-500",
  },
  inProgress: {
    icon: Loader,
    className: "bg-amber-50 text-amber-700 border-amber-100",
    iconClass: "text-amber-500",
  },
};

export function TestsTab({ tests }: TestsTabProps) {
  const { t } = useTranslation("profile");

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-indigo-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">{t("tests.noTests")}</p>
        <p className="text-sm text-gray-400 mt-1">{t("tests.noTestsDesc")}</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
      {tests.map((test) => {
        const cfg = statusConfig[test.status];
        const StatusIcon = cfg.icon;
        const canRetry = test.status === "failed" && test.attempts < test.maxAttempts;
        const gradeDisplay =
          test.grade !== null ? `${test.grade} / ${test.totalScore}` : "—";

        return (
          <motion.div
            key={test.id}
            variants={rowVariants}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Icon + Title */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <ClipboardList className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{test.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{test.courseName}</p>
                </div>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                {/* Status */}
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold",
                    cfg.className
                  )}
                >
                  <StatusIcon className={cn("w-3.5 h-3.5", cfg.iconClass)} />
                  {t(`tests.status.${test.status}`)}
                </span>

                {/* Grade */}
                <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700">
                  {gradeDisplay}
                </span>

                {/* Attempts */}
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {t("tests.attempts")}: {test.attempts}/{test.maxAttempts}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/courses/${test.courseId}/lectures/${test.lectureIndex}/test/${test.id}`}
                    id={`test-details-${test.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t("tests.viewDetails")}
                  </Link>
                  {canRetry && (
                    <Link
                      to={`/courses/${test.courseId}/lectures/${test.lectureIndex}/test/${test.id}`}
                      id={`test-retry-${test.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-medium text-white transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t("tests.retry")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
