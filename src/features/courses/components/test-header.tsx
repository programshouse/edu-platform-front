import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TestHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  isSubmitted: boolean;
  formatTime: (seconds: number) => string;
}

export function TestHeader({
  title,
  currentQuestion,
  totalQuestions,
  timeLeft,
  isSubmitted,
  formatTime,
}: TestHeaderProps) {
  const { t } = useTranslation("courses");

  return (
    <header className="bg-white border-b sticky top-0 z-10 px-4 py-4 sm:px-8">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("test.questionOf", {
              current: currentQuestion,
              total: totalQuestions,
            })}
          </p>
        </div>
        {!isSubmitted && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-mono font-medium border border-red-100">
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
