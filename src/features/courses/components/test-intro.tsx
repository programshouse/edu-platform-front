import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface TestIntroProps {
  title: string;
  durationMinutes: number;
  totalScore: number;
  attemptsAllowed: number;
  courseId: string | undefined;
  lectureIndex: string | undefined;
  onStart: () => void;
}

export function TestIntro({
  title,
  durationMinutes,
  totalScore,
  attemptsAllowed,
  courseId,
  lectureIndex,
  onStart,
}: TestIntroProps) {
  const { t } = useTranslation("courses");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("test.title", { name: title })}
        </h1>
        <div className="space-y-3 mb-8 text-gray-600">
          <p className="flex justify-between border-b pb-2">
            <span>{t("test.duration")}</span>
            <span className="font-semibold text-gray-900">
              {durationMinutes} min
            </span>
          </p>
          <p className="flex justify-between border-b pb-2">
            <span>{t("test.totalScore")}</span>
            <span className="font-semibold text-gray-900">
              {totalScore}
            </span>
          </p>
          <p className="flex justify-between pb-2">
            <span>{t("test.attempts")}</span>
            <span className="font-semibold text-gray-900">
              {attemptsAllowed}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onStart}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            {t("test.startTest")}
          </button>
          <Link
            to={`/courses/${courseId}/lectures/${lectureIndex}`}
            className="w-full py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            {t("test.backToCourse")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
