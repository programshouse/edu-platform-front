import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Loader2,
  AlertCircle,
  BookOpen,
  RotateCcw,
  Clock,
  Award,
  HelpCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { axiosInstance } from "@/shared/api";
import { instructorTestsApi } from "@/features/teacher/test-results/api";
import { fetchExamShow } from "../api/exams-api";

// ================= TYPES =================

interface Option {
  id: number | string;
  option_en?: string;
  option_ar?: string;
  text?: string;
  option?: string;
  is_correct?: number | boolean | string;
}

interface Question {
  id: number | string;
  question_en?: string;
  question_ar?: string;
  text?: string;
  question?: string;
  title?: string;
  type?: string;
  mark?: number;
  points?: number;
  grade?: number;
  options?: Option[];
  correctAnswer?: string | number;
}

// ================= QUESTION BLOCK =================

function QuestionBlock({
  q,
  index,
  isAr,
}: {
  q: Question;
  index: number;
  isAr: boolean;
}) {
  const questionTitle = isAr
    ? q.question_ar || q.text || q.question || q.title || q.question_en || ""
    : q.question_en || q.text || q.question || q.title || q.question_ar || "";

  const mark = Number(q.mark ?? q.points ?? q.grade ?? 0);
  const qType = (q.type || "").toLowerCase();
  const isTf = qType === "tf" || qType === "true_false" || qType === "boolean";
  const isEssay = qType === "essay" || qType === "written" || qType === "text";

  // Build options: if TF has no explicit options, construct True/False
  let options = q.options && q.options.length > 0 ? q.options : [];
  if (isTf && options.length === 0) {
    const isTrueCorrect =
      String(q.correctAnswer).toLowerCase() === "true" ||
      String(q.correctAnswer) === "1";
    const isFalseCorrect =
      String(q.correctAnswer).toLowerCase() === "false" ||
      String(q.correctAnswer) === "0";

    options = [
      {
        id: "true",
        option_ar: "صح",
        option_en: "True",
        is_correct: isTrueCorrect,
      },
      {
        id: "false",
        option_ar: "خطأ",
        option_en: "False",
        is_correct: isFalseCorrect,
      },
    ];
  }

  const getTypeBadgeLabel = () => {
    if (isEssay) return isAr ? "مقالي" : "Essay";
    if (isTf) return isAr ? "صح / خطأ" : "True / False";
    return isAr ? "اختيار من متعدد" : "Multiple Choice";
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-xs overflow-hidden transition-colors hover:border-primary/30">
      <div className="bg-muted/40 border-b px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>

          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-sm font-semibold leading-relaxed break-words">
              {questionTitle || (isAr ? `السؤال ${index + 1}` : `Question ${index + 1}`)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-[11px] font-normal">
            {getTypeBadgeLabel()}
          </Badge>
          <Badge variant="secondary" className="font-semibold text-xs">
            {mark} {isAr ? "درجة" : "pts"}
          </Badge>
        </div>
      </div>

      {options.length > 0 && (
        <div className="p-3.5 space-y-2">
          {options.map((opt, optIdx) => {
            const optText = isAr
              ? opt.option_ar || opt.text || opt.option || opt.option_en || ""
              : opt.option_en || opt.text || opt.option || opt.option_ar || "";

            const isCorrect = Boolean(
              opt.is_correct === 1 ||
                opt.is_correct === "1" ||
                opt.is_correct === true ||
                (q.correctAnswer != null &&
                  String(q.correctAnswer) === String(opt.id))
            );

            return (
              <div
                key={opt.id ?? optIdx}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm transition-colors",
                  isCorrect
                    ? "border-emerald-400 bg-emerald-50/70 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-800 font-medium"
                    : "border-border/60 bg-background text-muted-foreground"
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 shrink-0 text-muted-foreground/30" />
                )}

                <span className="flex-1 break-words">
                  {optText || (isAr ? `الخيار ${optIdx + 1}` : `Option ${optIdx + 1}`)}
                </span>

                {isCorrect && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {isAr ? "الإجابة الصحيحة" : "Correct"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isEssay && options.length === 0 && (
        <div className="px-4 py-3 text-xs text-muted-foreground bg-muted/20 flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>
            {isAr
              ? "سؤال مقالي - يتم تصحيحه يدويًا من قبل المعلم"
              : "Essay question - to be manually graded by instructor"}
          </span>
        </div>
      )}
    </div>
  );
}

// ================= MODAL =================

interface ExamShowModalProps {
  examId: string | number | null;
  examTitle?: string;
  open: boolean;
  onClose: () => void;
}

export function ExamShowModal({
  examId,
  examTitle,
  open,
  onClose,
}: ExamShowModalProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exam-show-details", examId],
    queryFn: async () => {
      if (!examId) return null;

      // 1. Try dedicated helper fetchExamShow
      try {
        if (typeof fetchExamShow === "function") {
          const res = await fetchExamShow(examId);
          if (res) return res;
        }
      } catch {}

      // 2. Try instructorTestsApi methods
      if (typeof instructorTestsApi?.showTest === "function") {
        try {
          const res = await instructorTestsApi.showTest(examId);
          if (res) return res;
        } catch {}
      }

      if (typeof instructorTestsApi?.getTestDetails === "function") {
        try {
          const res = await instructorTestsApi.getTestDetails(examId);
          if (res) return res;
        } catch {}
      }

      // 3. Direct Axios Fallback
      try {
        const { data: res } = await axiosInstance.get(`/tests/${examId}`);
        return res?.data ?? res;
      } catch {
        const { data: res } = await axiosInstance.get("/instructor/tests");
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const found = list.find((item: any) => String(item.id) === String(examId));
        if (found) return found;
        throw new Error("Exam not found");
      }
    },
    enabled: Boolean(examId) && open,
    staleTime: 30_000,
  });

  const parsedExam = useMemo(() => {
    if (!data) return null;
    const examObj = data?.test ?? data?.data?.test ?? data?.data ?? data;
    return typeof examObj === "object" && !Array.isArray(examObj) ? examObj : null;
  }, [data]);

  const questions: Question[] = useMemo(() => {
    if (!data) return [];

    const raw =
      data?.questions ??
      data?.data?.questions ??
      data?.test?.questions ??
      data?.data?.test?.questions ??
      data?.test_questions ??
      data?.data?.test_questions ??
      (Array.isArray(data?.data) ? data.data : null) ??
      (Array.isArray(data) ? data : []);

    if (!Array.isArray(raw)) return [];

    return raw.map((q: any, idx: number) => ({
      id: q.id ?? idx + 1,
      question_en: q.question_en ?? q.text ?? q.question ?? q.title ?? "",
      question_ar:
        q.question_ar ?? q.text ?? q.question ?? q.title ?? q.question_en ?? "",
      type: q.type ?? (Array.isArray(q.options) && q.options.length > 0 ? "mcq" : "essay"),
      mark: Number(q.mark ?? q.points ?? q.grade ?? 0),
      options: Array.isArray(q.options)
        ? q.options.map((opt: any, optIdx: number) => ({
            id: opt.id ?? optIdx + 1,
            option_en: opt.option_en ?? opt.text ?? opt.option ?? opt.title ?? "",
            option_ar:
              opt.option_ar ?? opt.text ?? opt.option ?? opt.title ?? opt.option_en ?? "",
            is_correct:
              opt.is_correct === 1 ||
              opt.is_correct === "1" ||
              opt.is_correct === true ||
              (q.correctAnswer != null &&
                String(q.correctAnswer) === String(opt.id)),
          }))
        : [],
      correctAnswer: q.correctAnswer ?? q.correct_answer,
    }));
  }, [data]);

  const totalMark = useMemo(() => {
    if (parsedExam?.full_mark != null || parsedExam?.totalGrade != null) {
      return Number(parsedExam.full_mark ?? parsedExam.totalGrade);
    }
    return questions.reduce((sum, q) => sum + Number(q.mark ?? 0), 0);
  }, [parsedExam, questions]);

  const title =
    examTitle ||
    parsedExam?.title ||
    (isAr ? parsedExam?.title_ar : parsedExam?.title_en) ||
    (isAr ? "تفاصيل الاختبار" : "Exam Details");

  const duration = parsedExam?.duration ?? parsedExam?.durationMins;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base sm:text-lg font-bold truncate">
                {title}
              </DialogTitle>
              {parsedExam?.course_title && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {parsedExam.course_title}
                </p>
              )}
            </div>
          </div>

          {/* Quick stats pills */}
          {!isLoading && !isError && (
            <div className="flex flex-wrap items-center gap-2 pt-2.5">
              <Badge variant="secondary" className="gap-1 text-xs py-0.5">
                <BookOpen className="w-3.5 h-3.5" />
                {questions.length} {isAr ? "أسئلة" : "questions"}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs py-0.5">
                <Award className="w-3.5 h-3.5" />
                {totalMark} {isAr ? "درجة إجمالية" : "total pts"}
              </Badge>
              {duration ? (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  {duration} {isAr ? "دقيقة" : "mins"}
                </Badge>
              ) : null}
            </div>
          )}
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
              <p className="text-xs text-muted-foreground">
                {isAr ? "جارٍ تحميل تفاصيل الاختبار..." : "Loading exam details..."}
              </p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center gap-3.5 py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-destructive font-semibold text-base">
                  {isAr ? "فشل تحميل الاختبار" : "Failed to load exam"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  {(error as any)?.message ||
                    (isAr
                      ? "تعذر جلب تفاصيل الاختبار من الخادم"
                      : "Could not retrieve exam details from server")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2 gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {isAr ? "إعادة المحاولة" : "Retry"}
              </Button>
            </div>
          )}

          {!isLoading && !isError && questions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {isAr ? "لا توجد أسئلة مضافة في هذا الاختبار بعد" : "No questions added to this exam yet"}
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            questions.map((q, index) => (
              <QuestionBlock key={q.id ?? index} q={q} index={index} isAr={isAr} />
            ))}
        </div>

        {/* Footer Summary */}
        {!isLoading && !isError && questions.length > 0 && (
          <div className="border-t bg-muted/20 px-5 py-3 flex items-center justify-between text-sm">
            <span className="text-xs text-muted-foreground">
              {isAr
                ? `إجمالي الأسئلة: ${questions.length}`
                : `Total Questions: ${questions.length}`}
            </span>
            <span className="font-bold text-xs sm:text-sm text-foreground">
              {isAr ? `الدرجة الكاملة: ${totalMark}` : `Full Mark: ${totalMark} pts`}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}