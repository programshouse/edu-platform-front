import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
  User,
  AlertCircle,
  PenLine,
  BookOpen,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TeacherPageLayout } from "../components/teacher-page-layout";
import { instructorTestsApi } from "./api";


// ─── Types ────────────────────────────────────────────────

interface AnswerOption {
  id:        number;
  option_en: string;
  option_ar: string;
}

interface SubmittedQuestion {
  id:                        number;
  question_en:               string;
  question_ar:               string;
  mark:                      number;
  type:                      string;
  options?:                  AnswerOption[];
  student_answer_option_id?: number | null;
  student_answer_text?:      string | null;
}

interface StudentEntry {
  student:         { id: number; name: string };
  test:            { id: number; title: string; full_mark: number };
  student_mark:    number | null;
  full_mark:       number;
  result:          string | null;
  student_attempt: number;
  submitted_at?:   string;
  questions?:      SubmittedQuestion[];
}

// ─── Normalise API response ───────────────────────────────

function normalise(r: any, testId: string): StudentEntry {
  return {
    student:         r.student        ?? { id: r.student_id ?? 0, name: r.student_name ?? String(r.student ?? "—") },
    test:            r.test           ?? { id: Number(testId), title: "", full_mark: r.full_mark ?? 0 },
    student_mark:    r.student_mark   ?? r.mark  ?? null,
    full_mark:       r.full_mark      ?? r.test?.full_mark ?? 0,
    result:          r.result         ?? null,
    student_attempt: r.student_attempt ?? 1,
    submitted_at:    r.submitted_at   ?? null,
    questions:       Array.isArray(r.questions) ? r.questions : [],
  };
}


// ─── Question card ────────────────────────────────────────

function QuestionCard({ q, index }: { q: SubmittedQuestion; index: number }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">

      {/* Header */}
      <div className="bg-muted/40 border-b px-5 py-3.5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <p className="font-medium text-foreground leading-relaxed text-sm">
            {q.question_ar || q.question_en}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {q.mark} درجة
        </Badge>
      </div>

      {/* Answer */}
      <div className="px-5 py-4">

        {q.type === "essay" ? (
          <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground/80 leading-relaxed min-h-[80px] border">
            {q.student_answer_text || (
              <span className="text-muted-foreground italic">لم يكتب الطالب إجابة</span>
            )}
          </div>

        ) : Array.isArray(q.options) && q.options.length > 0 ? (
          <div className="space-y-2">
            {q.options.map((opt) => {
              const chosen = opt.id === q.student_answer_option_id;
              return (
                <div
                  key={opt.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm transition-colors",
                    chosen
                      ? "border-primary/40 bg-primary/5 text-primary font-medium"
                      : "border-border text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                    chosen ? "border-primary" : "border-muted-foreground/30"
                  )}>
                    {chosen && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="flex-1">{opt.option_ar || opt.option_en}</span>
                  {chosen && (
                    <Badge className="text-xs shrink-0">إجابة الطالب</Badge>
                  )}
                </div>
              );
            })}
          </div>

        ) : (
          <p className="text-sm text-muted-foreground italic">لا توجد خيارات</p>
        )}

      </div>
    </div>
  );
}


// ─── Main page ────────────────────────────────────────────

export default function InstructorCorrectionPage() {

  const { id = "" }  = useParams();
  const queryClient  = useQueryClient();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mark,        setMark]        = useState("");
  const [savedMarks,  setSavedMarks]  = useState<Record<number, number>>({});


  // ── Data ─────────────────────────────────────────────────
  const { data: raw = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["correction-data", id],
    queryFn:  async () => {
      const res = await instructorTestsApi.getStudentResults(id);
      if (Array.isArray(res) && res.length > 0) return res;
      return instructorTestsApi.getPendingForTest(id);
    },
    enabled: !!id,
  });

  const entries: StudentEntry[] = (raw as any[]).map((r) => normalise(r, id));


  // ── Mark mutation ────────────────────────────────────────
  const { mutate: saveMark, isPending: saving } = useMutation({
    mutationFn: () => instructorTestsApi.markStudent(id, entries[selectedIdx].student.id, mark),
    onSuccess: () => {
      setSavedMarks((p) => ({ ...p, [entries[selectedIdx].student.id]: Number(mark) }));
      toast.success("تم حفظ الدرجة بنجاح ✓");
      setMark("");
      queryClient.invalidateQueries({ queryKey: ["correction-data",          id] });
      queryClient.invalidateQueries({ queryKey: ["instructor-test-results",  id] });
      if (selectedIdx < entries.length - 1) setSelectedIdx((p) => p + 1);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "فشل حفظ الدرجة"),
  });


  // ── Breadcrumb in header ──────────────────────────────────
  const headerContent = (
    <div className="flex items-center gap-2 text-sm min-w-0">
      <Link to="/teacher/tests"         className="text-muted-foreground hover:text-foreground transition-colors">الاختبارات</Link>
      <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <Link to={`/teacher/tests/${id}/results`} className="text-muted-foreground hover:text-foreground transition-colors truncate">النتائج</Link>
      <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="font-semibold text-foreground truncate">تصحيح الاختبار</span>
    </div>
  );

  const headerActions = (
    <Button variant="outline" size="sm" asChild>
      <Link to={`/teacher/tests/${id}/results`}>عرض النتائج</Link>
    </Button>
  );


  // ── Loading / Error ───────────────────────────────────────
  if (isLoading) return (
    <TeacherPageLayout headerContent={headerContent} headerActions={headerActions}>
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    </TeacherPageLayout>
  );

  if (isError) return (
    <TeacherPageLayout headerContent={headerContent} headerActions={headerActions}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-destructive font-semibold">فشل تحميل البيانات</p>
        <Button variant="outline" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    </TeacherPageLayout>
  );

  // ── Empty ─────────────────────────────────────────────────
  if (!entries.length) return (
    <TeacherPageLayout headerContent={headerContent} headerActions={headerActions}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold">لا توجد إجابات للتصحيح</h2>
        <p className="text-muted-foreground text-sm">لم يُسلّم أي طالب هذا الاختبار بعد</p>
        <Button asChild><Link to={`/teacher/tests/${id}/results`}>عرض النتائج</Link></Button>
      </div>
    </TeacherPageLayout>
  );


  const current  = entries[selectedIdx];
  const fullMark = current.full_mark || current.test?.full_mark || 0;
  const isDone   = savedMarks[current.student.id] !== undefined
                || (current.student_mark !== null && current.student_mark !== undefined);
  const displayMark = savedMarks[current.student.id] ?? current.student_mark;


  // ── Main ─────────────────────────────────────────────────
  return (
    <TeacherPageLayout headerContent={headerContent} headerActions={headerActions}>
      <div className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6" dir="rtl">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">


          {/* ── Student navigator ── */}
          <div className="rounded-xl border bg-card shadow-sm p-4">

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <ClipboardList className="w-4 h-4 text-primary" />
                الطلاب المُسلِّمون ({entries.length})
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline" size="icon-sm"
                  disabled={selectedIdx === 0}
                  onClick={() => { setSelectedIdx((p) => Math.max(0, p - 1)); setMark(""); }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-14 text-center">
                  {selectedIdx + 1} / {entries.length}
                </span>
                <Button
                  variant="outline" size="icon-sm"
                  disabled={selectedIdx === entries.length - 1}
                  onClick={() => { setSelectedIdx((p) => Math.min(entries.length - 1, p + 1)); setMark(""); }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {entries.map((e, i) => {
                const graded = savedMarks[e.student.id] !== undefined
                            || (e.student_mark !== null && e.student_mark !== undefined);
                return (
                  <button
                    key={e.student.id}
                    onClick={() => { setSelectedIdx(i); setMark(""); }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      i === selectedIdx
                        ? "border-primary bg-primary/5 text-primary"
                        : graded
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                    )}
                  >
                    <User className="w-3 h-3" />
                    {e.student.name}
                    {graded && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>


          {/* ── Content grid ── */}
          <div className="grid lg:grid-cols-3 gap-6 items-start">


            {/* Left — questions */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.student.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-4"
                >

                  {/* Student info bar */}
                  <div className="rounded-xl border bg-card shadow-sm px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{current.student.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        المحاولة #{current.student_attempt}
                        {current.submitted_at && (
                          <> · {new Date(current.submitted_at).toLocaleString("ar-EG")}</>
                        )}
                      </p>
                    </div>
                    {displayMark !== null && displayMark !== undefined && (
                      <Badge variant={current.result === "passed" ? "default" : "secondary"} className="shrink-0 text-sm px-3 py-1">
                        {displayMark} / {fullMark}
                      </Badge>
                    )}
                  </div>

                  {/* Questions */}
                  {Array.isArray(current.questions) && current.questions.length > 0
                    ? current.questions.map((q: SubmittedQuestion, i: number) => (
                        <QuestionCard key={q.id ?? i} q={q} index={i} />
                      ))
                    : (
                      <div className="rounded-xl border bg-card p-10 text-center">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="font-medium text-muted-foreground">لا تتوفر تفاصيل الإجابات</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">يمكنك إدخال الدرجة من لوحة التقييم</p>
                      </div>
                    )
                  }

                </motion.div>
              </AnimatePresence>
            </div>


            {/* Right — grading panel */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border bg-card shadow-sm p-5 sticky top-[4.5rem]">

                <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-primary" />
                  التقييم
                </h2>

                {/* Student */}
                <div className="mb-4 flex items-center gap-3 p-3 bg-muted/40 rounded-lg border">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">الطالب</p>
                    <p className="text-sm font-semibold text-foreground">{current.student.name}</p>
                  </div>
                </div>

                {/* Full mark */}
                {fullMark > 0 && (
                  <div className="mb-4 flex justify-between items-center p-3 bg-muted/40 rounded-lg border text-sm">
                    <span className="text-muted-foreground">الدرجة الكاملة</span>
                    <span className="font-bold text-foreground">{fullMark}</span>
                  </div>
                )}

                {/* Previous mark */}
                {isDone && (
                  <div className="mb-4 flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm">
                    <span className="text-emerald-600">الدرجة المسجلة</span>
                    <span className="font-bold text-emerald-700">{displayMark}</span>
                  </div>
                )}

                {/* Mark input */}
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {isDone ? "تعديل الدرجة" : "أدخل الدرجة"}
                </label>
                <input
                  type="number"
                  min={0}
                  max={fullMark || undefined}
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  placeholder={fullMark ? `0 – ${fullMark}` : "الدرجة"}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-ring mb-1"
                />

                {mark !== "" && fullMark > 0 && (Number(mark) < 0 || Number(mark) > fullMark) && (
                  <p className="text-xs text-destructive mb-2">
                    يجب أن تكون الدرجة بين 0 و {fullMark}
                  </p>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    onClick={() => saveMark()}
                    disabled={
                      saving ||
                      mark === "" ||
                      (fullMark > 0 && (Number(mark) < 0 || Number(mark) > fullMark))
                    }
                    className="w-full"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin me-1" />}
                    حفظ الدرجة
                  </Button>

                  {selectedIdx < entries.length - 1 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { setSelectedIdx((p) => p + 1); setMark(""); }}
                    >
                      الطالب التالي ←
                    </Button>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </TeacherPageLayout>
  );
}
