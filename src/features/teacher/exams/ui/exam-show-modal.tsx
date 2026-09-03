import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { instructorTestsApi } from "@/features/teacher/test-results/api";


// ─── Types ────────────────────────────────────────────────

interface Option {
  id:          number;
  option_en:   string;
  option_ar:   string;
  is_correct:  number | boolean;
}

interface Question {
  id:          number;
  question_en: string;
  question_ar: string;
  type:        string;
  mark:        number;
  options?:    Option[];
}


// ─── Question block ───────────────────────────────────────

function QuestionBlock({
  q,
  index,
  isAr,
}: {
  q:     Question;
  index: number;
  isAr:  boolean;
}) {
  return (
    <div className="rounded-xl border overflow-hidden">

      {/* Header */}
      <div className="bg-muted/40 border-b px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {isAr ? q.question_ar : q.question_en}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">{q.mark} pts</Badge>
      </div>

      {/* Options */}
      {Array.isArray(q.options) && q.options.length > 0 && (
        <div className="p-3 space-y-2">
          {q.options.map((opt) => {
            const correct = Boolean(opt.is_correct);
            return (
              <div
                key={opt.id}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm",
                  correct
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800 font-medium"
                    : "border-border text-muted-foreground"
                )}
              >
                {correct
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  : <Circle       className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                }
                <span className="flex-1">
                  {isAr ? opt.option_ar : opt.option_en}
                </span>
                {correct && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {isAr ? "صحيح" : "Correct"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Essay note */}
      {q.type === "essay" && (
        <div className="px-4 py-3 text-sm text-muted-foreground italic">
          {isAr ? "سؤال مقالي — لا خيارات" : "Essay question — no options"}
        </div>
      )}

    </div>
  );
}


// ─── Modal ───────────────────────────────────────────────

interface ExamShowModalProps {
  examId:   string | null;
  examTitle?: string;
  open:     boolean;
  onClose:  () => void;
}

export function ExamShowModal({
  examId,
  examTitle,
  open,
  onClose,
}: ExamShowModalProps) {

  const { i18n } = useTranslation();
  const isAr     = i18n.language.startsWith("ar");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["exam-show", examId],
    queryFn:  () => instructorTestsApi.showTest(examId!),
    enabled:  !!examId && open,
  });

  const questions: Question[] = Array.isArray(data) ? data : (data?.questions ?? []);

  const totalMark = questions.reduce((s, q) => s + (q.mark ?? 0), 0);


  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col" dir={isAr ? "rtl" : "ltr"}>

        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="w-5 h-5 text-primary" />
            {examTitle ?? (isAr ? "تفاصيل الاختبار" : "Exam Details")}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pe-1">

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="text-destructive font-semibold text-sm">
                {isAr ? "فشل تحميل الاختبار" : "Failed to load exam"}
              </p>
            </div>
          )}

          {!isLoading && !isError && questions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">
                {isAr ? "لا توجد أسئلة في هذا الاختبار" : "No questions in this exam"}
              </p>
            </div>
          )}

          {!isLoading && questions.map((q, i) => (
            <QuestionBlock key={q.id} q={q} index={i} isAr={isAr} />
          ))}

        </div>

        {/* Footer summary */}
        {!isLoading && questions.length > 0 && (
          <div className="shrink-0 border-t pt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>{isAr ? `${questions.length} سؤال` : `${questions.length} questions`}</span>
            <span className="font-semibold text-foreground">
              {isAr ? `الدرجة الكاملة: ${totalMark}` : `Total: ${totalMark} pts`}
            </span>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
