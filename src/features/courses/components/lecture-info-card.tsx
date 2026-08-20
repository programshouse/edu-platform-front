import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  ShieldCheck,
  Lock,
  BarChart3,
  CreditCard,
  ShoppingCart,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type Lecture = {
  title: string;
  duration: string;
  isFree: boolean;
};

type LectureInfoCardProps = {
  courseId: string;
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  lectures: Lecture[];
  level: string;
  purchaseSeparately: boolean;
};

export function LectureInfoCard({
  courseId,
  lecture,
  lectureIndex,
  totalLectures,
  lectures,
  level,
  purchaseSeparately,
}: LectureInfoCardProps) {
  const { t, i18n } = useTranslation("courses");
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const infoItems = [
    {
      icon: Clock,
      label: t("details.labels.duration"),
      value: lecture.duration,
    },
    {
      icon: lecture.isFree ? ShieldCheck : Lock,
      label: t("details.labels.status"),
      value: lecture.isFree
        ? t("details.labels.free")
        : t("details.labels.locked"),
      valueColor: lecture.isFree ? "text-emerald-600" : "text-red-500",
    },
    {
      icon: BarChart3,
      label: t("details.labels.level"),
      value: t(`card.level.${level}`),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-blue-100/20 overflow-hidden lg:sticky lg:top-8"
    >
      {/* Lecture Number Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="shrink-0 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-bold flex items-center justify-center">
            {lectureIndex + 1}
          </span>
          <div className="min-w-0">
            <p className="text-blue-200 text-xs font-medium">
              {t("details.labels.lectureNumber")} {lectureIndex + 1} /{" "}
              {totalLectures}
            </p>
            <p className="text-white font-bold text-lg truncate">
              {lecture.title}
            </p>
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="p-5 space-y-0">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              <item.icon className="w-4.5 h-4.5 text-blue-500" />
              <span>{item.label}</span>
            </div>
            <span
              className={`text-sm font-semibold ${item.valueColor || "text-gray-800"}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="px-5 pb-4">
        {purchaseSeparately ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group flex items-center justify-center gap-2.5 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-200 text-base cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            {t("details.labels.purchaseLecture")}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/courses/${courseId}`)}
            className="w-full group flex items-center justify-center gap-2.5 px-6 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-200 text-base cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {t("details.labels.subscribeToCourse")}
          </motion.button>
        )}
      </div>

      {/* Back to Course Link */}
      <div className="px-5 pb-3">
        <Link
          to={`/courses/${courseId}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <BackIcon className="w-4 h-4" />
          {t("details.labels.backToCourse")}
        </Link>
      </div>

      {/* Course Lectures Mini-Nav */}
      <div className="border-t border-gray-100">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <PlayCircle className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-bold text-gray-700">
              {t("details.labels.courseLecturesList")}
            </h3>
          </div>
          <div className="space-y-1 max-h-[280px] overflow-y-auto pe-1 custom-scrollbar">
            {lectures.map((lec, idx) => {
              const isActive = idx === lectureIndex;
              return (
                <Link
                  key={idx}
                  to={`/courses/${courseId}/lectures/${idx}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate flex-1">{lec.title}</span>
                  {lec.isFree ? (
                    <span className="shrink-0 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {t("details.labels.free")}
                    </span>
                  ) : (
                    <Lock className="shrink-0 w-3 h-3 text-gray-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
