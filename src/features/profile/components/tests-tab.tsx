import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

import { testsApi } from "./../api/tests-api";
import { cn } from "@/shared/lib/utils";


interface StudentTest {
  id: number;
  title: string;
  course_title?: string;
  lecture_title?: string;
  full_mark: number;
  student_mark: number | null;
  result: "passed" | "failed" | null;
  student_attempts: number;
  status?: "available" | "locked";
}


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};


export function TestsTab() {

  const { i18n } = useTranslation("profile");

  const isAr = i18n.language.startsWith("ar");


  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-tests"],
    queryFn: testsApi.getStudentTests,
  });


  const tests: StudentTest[] = data?.data ?? [];


  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }


  // ── Error ────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        {isAr ? "فشل تحميل الاختبارات" : "Failed to load tests"}
      </div>
    );
  }


  // ── Empty ────────────────────────────────────────────────
  if (!tests.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">

        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-indigo-400" />
        </div>

        <p className="text-lg font-semibold text-gray-700">
          {isAr ? "لم تجر اختبارات بعد" : "No tests yet"}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          {isAr
            ? "أكمل محاضرات دوراتك لفتح الاختبارات"
            : "Complete your course lectures to unlock tests"}
        </p>

      </div>
    );
  }


  // ── List ─────────────────────────────────────────────────
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      {tests.map((test) => {

        const hasTaken   = test.student_mark !== null;
        const passed     = test.result === "passed";
        const percentage = test.full_mark
          ? Math.round(((test.student_mark ?? 0) / test.full_mark) * 100)
          : 0;

        return (
          <motion.div
            key={test.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >

            {/* Top colour strip */}
            <div className={cn(
              "h-1.5 w-full",
              !hasTaken ? "bg-blue-500" :
              passed    ? "bg-emerald-500" :
              "bg-red-500"
            )} />


            <div className="p-5 flex flex-col gap-3 flex-1">

              {/* Badge + title */}
              <div className="flex items-start justify-between gap-2">

                <h3 className="font-bold text-gray-900 leading-snug">
                  {test.title}
                </h3>

                {hasTaken && (
                  <span className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0",
                    passed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  )}>
                    {passed
                      ? <><CheckCircle2 className="w-3 h-3" />{isAr ? "ناجح" : "Passed"}</>
                      : <><XCircle      className="w-3 h-3" />{isAr ? "راسب" : "Failed"}</>
                    }
                  </span>
                )}

              </div>


              {/* Course / lecture meta */}
              {(test.course_title || test.lecture_title) && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{test.course_title}</span>
                  {test.lecture_title && (
                    <span className="text-gray-300">· {test.lecture_title}</span>
                  )}
                </div>
              )}


              {/* Score bar (only if taken) */}
              {hasTaken && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">
                      {isAr ? "الدرجة" : "Score"}
                    </span>
                    <span className="font-bold text-blue-600">
                      {test.student_mark} / {test.full_mark}
                      <span className="text-gray-400 font-normal ms-1">
                        ({percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        passed ? "bg-emerald-500" : "bg-red-500"
                      )}
                    />
                  </div>
                </div>
              )}


              {/* Attempts */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {isAr
                  ? `المحاولات: ${test.student_attempts ?? 0}`
                  : `Attempts: ${test.student_attempts ?? 0}`}
              </div>


              {/* CTA */}
              <div className="mt-auto pt-2 flex gap-2">

                <Link
                  to={`/student/tests/${test.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  {hasTaken
                    ? (isAr ? "إعادة الاختبار" : "Retake")
                    : (isAr ? "ابدأ الاختبار" : "Start Test")}
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {hasTaken && (
                  <Link
                    to={`/student/tests/${test.id}/results`}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {isAr ? "النتيجة" : "Results"}
                  </Link>
                )}

              </div>

            </div>

          </motion.div>
        );
      })}
    </motion.div>
  );
}
