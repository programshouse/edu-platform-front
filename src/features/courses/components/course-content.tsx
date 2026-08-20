import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Lock,
  Eye,
  Clock,
  ChevronDown,
  FileText,
  ClipboardCheck,
} from "lucide-react";

type Lecture = {
  title: string;
  duration: string;
  isFree: boolean;
};

type TestOrAssignment = {
  title: string;
  type: "quiz" | "assignment";
};

type CourseContentProps = {
  courseId: string;
  detailedDescription: string;
  lectures: Lecture[];
  testsAndAssignments: TestOrAssignment[];
};

export function CourseContent({
  courseId,
  detailedDescription,
  lectures,
  testsAndAssignments,
}: CourseContentProps) {
  const { t } = useTranslation("courses");
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null);

  const toggleLecture = (index: number) => {
    setExpandedLecture(expandedLecture === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-10">
      {/* ─── About This Course ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t("details.labels.aboutCourse")}
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-gray-600 leading-relaxed text-[15px] sm:text-base">
            {detailedDescription}
          </p>
        </div>
      </motion.section>

      {/* ─── Lectures List ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t("details.labels.courseLectures")}
          </h2>
          <span className="ms-auto text-sm text-gray-400 font-medium">
            {lectures.length} {t("details.labels.lecturesUnit")}
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          {lectures.map((lecture, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`border-b border-gray-50 last:border-b-0 transition-colors ${
                expandedLecture === index
                  ? "bg-blue-50/50"
                  : "hover:bg-gray-50/50"
              }`}
            >
              <button
                onClick={() => toggleLecture(index)}
                className="w-full flex items-center gap-3 px-5 py-4 text-start cursor-pointer"
              >
                {/* Lecture Number */}
                <span className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {index + 1}
                </span>

                {/* Title */}
                <span className="flex-1 text-sm sm:text-[15px] font-medium text-gray-800">
                  {lecture.title}
                </span>

                {/* Free / Locked badge */}
                {lecture.isFree ? (
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    {t("details.labels.free")}
                  </span>
                ) : (
                  <Lock className="shrink-0 w-4 h-4 text-gray-300" />
                )}

                {/* Expand icon */}
                <ChevronDown
                  className={`shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    expandedLecture === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded Content */}
              {expandedLecture === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-4"
                >
                  <div className="ps-11 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {t("details.labels.duration")}: {lecture.duration}
                    </span>
                    <Link
                      to={`/courses/${courseId}/lectures/${index}`}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t("details.labels.viewLecture")}
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ─── Tests & Assignments ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t("details.labels.testsAndAssignments")}
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {testsAndAssignments.map((item, index) => {
            const isQuiz = item.type === "quiz";
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isQuiz
                    ? "bg-blue-50/50 border-blue-100 hover:border-blue-200"
                    : "bg-amber-50/50 border-amber-100 hover:border-amber-200"
                }`}
              >
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                    isQuiz
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {isQuiz ? (
                    <FileText className="w-4.5 h-4.5" />
                  ) : (
                    <ClipboardCheck className="w-4.5 h-4.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t(`details.labels.${item.type}`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    </div>
  );
}
