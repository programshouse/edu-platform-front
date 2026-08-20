import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

type LectureBannerProps = {
  bannerImage: string;
  courseTitle: string;
  lectureTitle: string;
  lectureNumber: number;
  level: string;
  courseId: string;
};

export function LectureBanner({
  bannerImage,
  courseTitle,
  lectureTitle,
  lectureNumber,
  level,
  courseId,
}: LectureBannerProps) {
  const { t, i18n } = useTranslation("courses");
  const isRTL = i18n.language === "ar";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const levelColors: Record<string, string> = {
    beginner: "bg-emerald-500/90",
    intermediate: "bg-blue-500/90",
    advanced: "bg-purple-500/90",
  };

  return (
    <section className="relative h-[300px] sm:h-[360px] lg:h-[400px] overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={bannerImage}
          alt={lectureTitle}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-gray-950/90 via-gray-900/50 to-gray-900/20" />
      <div className="absolute inset-0 bg-linear-to-r from-blue-950/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-1.5 text-sm text-white/70 mb-5 flex-wrap"
        >
          <Link to="/" className="hover:text-white transition-colors">
            {t("details.breadcrumb.home")}
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 shrink-0" />
          <Link to="/courses" className="hover:text-white transition-colors">
            {t("details.breadcrumb.courses")}
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 shrink-0" />
          <Link
            to={`/courses/${courseId}`}
            className="hover:text-white transition-colors truncate max-w-[160px] sm:max-w-none"
          >
            {courseTitle}
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-white/90 font-medium truncate max-w-[200px] sm:max-w-none">
            {lectureTitle}
          </span>
        </motion.nav>

        {/* Title + Lecture Number + Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
            {lectureNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            {lectureTitle}
          </h1>
          <span
            className={`${levelColors[level] || "bg-gray-500/90"} text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm`}
          >
            {t(`card.level.${level}`)}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
