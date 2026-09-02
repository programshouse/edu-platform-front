import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import { testsApi } from "@/features/profile/api/tests-api";
import { cn } from "@/shared/lib/utils";


// ─── Types ────────────────────────────────────────────────

interface Option {
  id: number;
  option_en: string;
  option_ar: string;
}

interface Question {
  id: number;
  question_en: string;
  question_ar: string;
  type: string;
  mark: number;
  options: Option[];
}

type Phase = "intro" | "taking" | "submitting" | "results";


// ─── Helpers ──────────────────────────────────────────────

function ResultsView({
  testId,
  isAr,
}: {
  testId: string;
  isAr: boolean;
}) {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["test-results", testId],
    queryFn: () => testsApi.showTestResults(testId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          {isAr ? "فشل تحميل النتيجة" : "Failed to load results"}
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl"
        >
          {isAr ? "الملف الشخصي" : "Back to Profile"}
        </button>
      </div>
    );
  }

  const result = data.data;
  const passed = result.result === "passed";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center"
      >

        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
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
          "text-lg font-semibold mb-6",
          passed ? "text-emerald-600" : "text-red-500"
        )}>
          {passed
            ? (isAr ? "ناجح ✓" : "Passed ✓")
            : (isAr ? "راسب ✗" : "Failed ✗")}
        </p>

        <div className="text-4xl font-bold bg-gray-50 py-6 rounded-xl border mb-8">
          {result.mark}
          <span className="text-gray-400 text-2xl"> / {result.full_mark ?? "--"}</span>
        </div>

        <div className="flex flex-col gap-3">

          <Link
            to={`/student/tests/${testId}`}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            {isAr ? "إعادة الاختبار" : "Retake Test"}
          </Link>

          <Link
            to="/profile"
            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
          >
            {isAr ? "العودة للملف الشخصي" : "Back to Profile"}
          </Link>

        </div>

      </motion.div>
    </div>
  );
}


// ─── Main Page ────────────────────────────────────────────

export function StudentTestPage() {

  const { testId } = useParams<{ testId: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const isAr = i18n.language.startsWith("ar");

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitResult, setSubmitResult] = useState<any>(null);


  // ── Fetch test details (intro info) ─────────────────────
  const {
    data: detailsData,
    isLoading: detailsLoading,
    isError: detailsError,
    error: detailsRawError,
  } = useQuery({
    queryKey: ["test-details", testId],
    queryFn: () => testsApi.getTestDetails(testId!),
    enabled: !!testId,
    retry: (_, err: any) => err?.response?.status !== 403,
  });


  // ── Fetch questions (only when taking) ──────────────────
  const {
    data: questionsData,
    isLoading: questionsLoading,
  } = useQuery({
    queryKey: ["test-questions", testId],
    queryFn: () => testsApi.getQuestions(testId!),
    enabled: !!testId && phase === "taking",
  });


  // ── Answer mutation ──────────────────────────────────────
  const answerMutation = useMutation({
    mutationFn: ({
      questionId,
      optionId,
    }: {
      questionId: number;
      optionId: number;
    }) => testsApi.answerQuestion(testId!, questionId, optionId),
  });


  // ── Submit mutation ──────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: () => testsApi.submitTest(testId!),
    onSuccess: (res) => {
      setSubmitResult(res?.data ?? res);
      setPhase("results");
    },
  });


  // ── Derived ──────────────────────────────────────────────

  const details = detailsData?.data ?? detailsData;

  const questions: Question[] =
    Array.isArray(questionsData?.data)
      ? questionsData.data
      : Array.isArray(questionsData)
        ? questionsData
        : [];

  const currentQuestion = questions[currentIdx];
  const totalQuestions  = questions.length;
  const allAnswered     = questions.every((q) => answers[q.id] !== undefined);


  // ── Select an option (answer immediately) ───────────────
  function selectOption(questionId: number, optionId: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    answerMutation.mutate({ questionId, optionId });
  }


  // ── Loading ──────────────────────────────────────────────
  if (detailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (detailsError || !testId) {
    const is403 = (detailsRawError as any)?.response?.status === 403;
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
              : (isAr ? "فشل تحميل الاختبار" : "Failed to load test")}
          </h2>
          <p className="text-gray-500 text-sm max-w-xs">
            {is403
              ? (isAr
                  ? "يجب أن تكون مسجلاً في الكورس للوصول إلى هذا الاختبار"
                  : "You must be enrolled in the course to access this test")
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


  // ── Results page ─────────────────────────────────────────
  if (phase === "results") {
    return <ResultsView testId={testId} isAr={isAr} />;
  }


  // ── Intro screen ─────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
        >

          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ClipboardList className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {details?.title ?? (isAr ? "الاختبار" : "Test")}
          </h1>

          {details?.course_title && (
            <p className="text-sm text-gray-400 mb-6">{details.course_title}</p>
          )}

          <div className="space-y-3 text-sm mb-8 text-start">

            {details?.full_mark !== undefined && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  {isAr ? "الدرجة الكاملة" : "Full Mark"}
                </span>
                <span className="font-semibold">{details.full_mark}</span>
              </div>
            )}

            {details?.student_attempts !== undefined && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">
                  {isAr ? "محاولاتك" : "Your Attempts"}
                </span>
                <span className="font-semibold">{details.student_attempts}</span>
              </div>
            )}

            {details?.student_mark !== null && details?.student_mark !== undefined && (
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">
                  {isAr ? "آخر نتيجة" : "Last Score"}
                </span>
                <span className="font-semibold">
                  {details.student_mark} / {details.full_mark}
                </span>
              </div>
            )}

          </div>

          <div className="flex flex-col gap-3">

            <button
              onClick={() => setPhase("taking")}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              {isAr ? "ابدأ الاختبار" : "Start Test"}
            </button>

            <Link
              to="/profile"
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors text-center"
            >
              {isAr ? "العودة" : "Go Back"}
            </Link>

          </div>

        </motion.div>
      </div>
    );
  }


  // ── Taking — questions loading ───────────────────────────
  if (questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }


  // ── Taking — question screen ──────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-4">
        <div className="container mx-auto max-w-3xl flex items-center justify-between">

          <div>
            <h1 className="font-bold text-gray-900 text-lg">
              {details?.title ?? (isAr ? "الاختبار" : "Test")}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isAr
                ? `السؤال ${currentIdx + 1} من ${totalQuestions}`
                : `Question ${currentIdx + 1} of ${totalQuestions}`}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-bold transition-colors",
                  i === currentIdx
                    ? "bg-blue-600 text-white"
                    : answers[q.id] !== undefined
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-500"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 mt-3">
          <div
            style={{
              width: `${totalQuestions ? ((currentIdx + 1) / totalQuestions) * 100 : 0}%`,
            }}
            className="h-full bg-blue-600 transition-all"
          />
        </div>
      </header>


      {/* Question */}
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-3xl">

          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 mb-6"
              >

                {/* Mark badge */}
                <span className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                  {isAr ? `${currentQuestion.mark} درجة` : `${currentQuestion.mark} pts`}
                </span>

                <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {isAr ? currentQuestion.question_ar : currentQuestion.question_en}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const selected = answers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectOption(currentQuestion.id, opt.id)}
                        className={cn(
                          "w-full text-start p-4 rounded-xl border-2 transition-all flex items-center gap-3",
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selected ? "border-blue-600" : "border-gray-300"
                        )}>
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="text-gray-800">
                          {isAr ? opt.option_ar : opt.option_en}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </motion.div>
            )}
          </AnimatePresence>


          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">

            <button
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors",
                currentIdx === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-50 text-gray-700"
              )}
            >
              {isAr
                ? <><ArrowRight className="w-4 h-4" />{" السابق"}</>
                : <><ArrowLeft  className="w-4 h-4" />{" Previous"}</>
              }
            </button>


            {currentIdx < totalQuestions - 1 ? (

              <button
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {isAr
                  ? <>{"التالي "}<ArrowLeft  className="w-4 h-4" /></>
                  : <>{"Next " }<ArrowRight className="w-4 h-4" /></>
                }
              </button>

            ) : (

              <button
                onClick={() => {
                  if (confirm(isAr ? "هل تريد تسليم الاختبار؟" : "Submit the test?")) {
                    setPhase("submitting");
                    submitMutation.mutate();
                  }
                }}
                disabled={submitMutation.isPending}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors",
                  allAnswered
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
              >
                {submitMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isAr ? "تسليم الاختبار" : "Submit Test"}
              </button>

            )}

          </div>

          {/* Unanswered warning */}
          {!allAnswered && (
            <p className="text-center text-xs text-amber-500 mt-4">
              {isAr
                ? `لم تجب على ${questions.filter((q) => answers[q.id] === undefined).length} سؤال بعد`
                : `${questions.filter((q) => answers[q.id] === undefined).length} question(s) unanswered`}
            </p>
          )}

        </div>
      </main>

    </div>
  );
}
