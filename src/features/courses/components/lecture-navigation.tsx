import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Lecture = {
  title: string;
  duration: string;
  isFree: boolean;
};

type LectureNavigationProps = {
  courseId: string;
  currentIndex: number;
  lectures: Lecture[];
};

export function LectureNavigation({
  courseId,
  currentIndex,
  lectures,
}: LectureNavigationProps) {
  const { t, i18n } = useTranslation("courses");
  const isRTL = i18n.language === "ar";

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lectures.length - 1;

  const prevLecture = hasPrev ? lectures[currentIndex - 1] : null;
  const nextLecture = hasNext ? lectures[currentIndex + 1] : null;

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex items-stretch justify-between gap-4 mt-8"
    >
      {/* Previous Lecture */}
      {hasPrev ? (
        <Link
          to={`/courses/${courseId}/lectures/${currentIndex - 1}`}
          className="flex-1 group flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0">
            <PrevIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              {t("details.labels.previousLecture")}
            </p>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 truncate transition-colors">
              {prevLecture?.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next Lecture */}
      {hasNext ? (
        <Link
          to={`/courses/${courseId}/lectures/${currentIndex + 1}`}
          className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 text-end"
        >
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              {t("details.labels.nextLecture")}
            </p>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 truncate transition-colors">
              {nextLecture?.title}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0">
            <NextIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </motion.div>
  );
}
