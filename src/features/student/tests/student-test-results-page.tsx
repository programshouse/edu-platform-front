import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
  MinusCircle,
  ShieldAlert,
} from "lucide-react";

import { testsApi } from "@/features/profile/api/tests-api";
import { cn } from "@/shared/lib/utils";


interface Option {
  id: number;
  option_en: string;
  option_ar: string;
}

interface ResultQuestion {
  question_id: number;
  question_en: string;
  question_ar: string;
  mark: number;
  student_answer_option_id: number | null;
  options: Option[];
}


export function StudentTestResultsPage() {

  const { testId } = useParams<{ testId: string }>();
  const { i18n }   = useTranslation();
  const isAr       = i18n.language.startsWith("ar");


  const { data, isLoading, isError, error: rawError } = useQuery({
    queryKey: ["test-results", testId],
    queryFn:  () => testsApi.showTestResults(testId!),
    enabled:  !!testId,
    retry: (_, err: any) => err?.response?.status !== 403,
  });


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (isError || !data?.data) {
    const is403 = (rawError as any)?.response?.status === 403;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-4" dir={isAr ? "rtl" : "ltr"}>
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center",
          is403 ? "bg-amber-100 text-amber-500" : "bg-red-100 text-red-500"
        )}>
          {is403 ? <ShieldAlert className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {is403
              ? (isAr ? "غير مصرح بالوصول" : "Access Denied")
              : (isAr ? "فشل تحميل النتيجة" : "Failed to load results")}
          </h2>
          <p className="text-gray-500 text-sm max-w-xs">
            {is403
              ? (isAr
                  ? "يجب أن تكون مسجلاً في الكورس للوصول إلى نتيجة هذا الاختبار"
                  : "You must be enrolled in the course to view this test result")
              : (isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred")}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/courses"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            {isAr ? "تصفح الكورسات" : "Browse Courses"}
          </Link>
          <Link
            to="/profile"
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            {isAr ? "ملفي الشخصي" : "My Profile"}
          </Link>
        </div>
      </div>
    );
  }

  const result    = data.data;
  const passed    = result.result === "passed";
  const fullMark  = result.full_mark ?? result.questions?.reduce((s: number, q: ResultQuestion) => s + (q.mark ?? 0), 0) ?? 0;
  const percent   = fullMark ? Math.round((result.mark / fullMark) * 100) : 0;
  const questions: ResultQuestion[] = Array.isArray(result.questions) ? result.questions : [];


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-2xl space-y-6">


        {/* ── Score card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        >
          <div className={cn("h-2", passed ? "bg-emerald-500" : "bg-red-500")} />

          <div className="p-8 text-center">

            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
              passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
            )}>
              {passed
                ? <CheckCircle2 className="w-10 h-10" />
                : <XCircle      className="w-10 h-10" />
              }
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {result.test_title}
            </h1>

            <p className={cn(
              "font-semibold text-lg mb-6",
              passed ? "text-emerald-600" : "text-red-500"
            )}>
              {passed
                ? (isAr ? "ناجح ✓" : "Passed ✓")
                : (isAr ? "راسب ✗" : "Failed ✗")}
            </p>

            {/* Score number */}
            <div className="bg-gray-50 rounded-2xl border py-6 mb-4">
              <p className="text-5xl font-bold text-gray-900">
                {result.mark}
                <span className="text-2xl text-gray-400"> / {fullMark || "--"}</span>
              </p>
              {!!fullMark && (
                <p className="text-gray-500 text-sm mt-2">{percent}%</p>
              )}
            </div>

            {/* Score bar */}
            {!!fullMark && (
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percent}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    passed ? "bg-emerald-500" : "bg-red-500"
                  )}
                />
              </div>
            )}

          </div>
        </motion.div>


        {/* ── Per-question breakdown ── */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border p-6"
          >
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              {isAr ? "تفاصيل الإجابات" : "Answer Breakdown"}
            </h2>

            <div className="space-y-5">
              {questions.map((q, index) => {

                const studentOptionId = q.student_answer_option_id;
                const answered        = studentOptionId !== null && studentOptionId !== undefined;

                return (
                  <div key={q.question_id} className="border rounded-xl overflow-hidden">

                    {/* Question header */}
                    <div className="flex items-start justify-between gap-3 p-4 bg-gray-50 border-b">

                      <div className="flex items-start gap-2">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                          {isAr ? q.question_ar : q.question_en}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                        {q.mark} {isAr ? "درجة" : "pts"}
                      </span>

                    </div>

                    {/* Options */}
                    <div className="p-3 space-y-2">
                      {Array.isArray(q.options) && q.options.length > 0
                        ? q.options.map((opt) => {

                            const isStudentChoice = opt.id === studentOptionId;

                            return (
                              <div
                                key={opt.id}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm transition-colors",
                                  isStudentChoice
                                    ? "border-blue-500 bg-blue-50 font-semibold text-blue-800"
                                    : "border-gray-100 bg-white text-gray-600"
                                )}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 shrink-0",
                                  isStudentChoice ? "border-blue-600 bg-blue-600" : "border-gray-300"
                                )} />
                                {isAr ? opt.option_ar : opt.option_en}
                                {isStudentChoice && (
                                  <span className="ms-auto text-xs text-blue-500">
                                    {isAr ? "إجابتك" : "Your answer"}
                                  </span>
                                )}
                              </div>
                            );
                          })
                        : (
                          // no options in response — just show answered/unanswered
                          <div className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl text-sm",
                            answered
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-50 text-gray-400"
                          )}>
                            {answered
                              ? <CheckCircle2 className="w-4 h-4" />
                              : <MinusCircle  className="w-4 h-4" />
                            }
                            {answered
                              ? (isAr ? "تمت الإجابة" : "Answered")
                              : (isAr ? "لم تجب"     : "Unanswered")}
                          </div>
                        )
                      }
                    </div>

                  </div>
                );
              })}
            </div>

          </motion.div>
        )}


        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">

          <Link
            to={`/student/tests/${testId}`}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center transition-colors"
          >
            {isAr ? "إعادة الاختبار" : "Retake Test"}
          </Link>

          <Link
            to="/profile"
            className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-center transition-colors"
          >
            {isAr ? "العودة للملف الشخصي" : "Back to Profile"}
          </Link>

        </div>

      </div>
    </div>
  );
}
