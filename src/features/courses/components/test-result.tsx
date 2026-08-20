import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface TestResultProps {
  score: number;
  totalScore: number;
  courseId: string | undefined;
  lectureIndex: string | undefined;
  onViewCorrection: () => void;
}

export function TestResult({
  score,
  totalScore,
  courseId,
  lectureIndex,
  onViewCorrection,
}: TestResultProps) {
  const { t } = useTranslation("courses");
  const passed = score >= totalScore / 2;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center"
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {passed ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("test.result")}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {passed ? (
            <span className="text-green-600 font-semibold">
              {t("test.passed")}
            </span>
          ) : (
            <span className="text-red-600 font-semibold">
              {t("test.failed")}
            </span>
          )}
        </p>
        <div className="text-3xl font-bold bg-gray-50 py-6 rounded-xl border mb-8">
          {score} / {totalScore}
          <p className="text-sm font-normal text-gray-500 mt-2">
            {t("test.scoreMsg", {
              score: score,
              total: totalScore,
            })}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onViewCorrection}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            {t("test.viewCorrection")}
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
