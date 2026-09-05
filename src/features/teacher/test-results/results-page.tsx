import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Loader2,
  AlertCircle,
  ClipboardEdit,
  BarChart3,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { TeacherPageLayout } from "../components/teacher-page-layout";
import { instructorTestsApi } from "./api";


// ─── Types ────────────────────────────────────────────────

interface StudentResult {
  student:         { id: number; name: string } | string;
  student_mark:    number | null;
  full_mark:       number;
  result:          "passed" | "failed" | "pending" | null;
  student_attempt: number;
  submitted_at?:   string;
}

function getName(s: StudentResult["student"]): string {
  if (!s) return "—";
  if (typeof s === "string") return s;
  return (s as any).name ?? "—";
}

// Normalise pending-test shape → StudentResult
function normaliseResult(r: any): StudentResult {
  const s = (typeof r.student === "object" && r.student !== null)
    ? r.student
    : (typeof r.user === "object" && r.user !== null)
      ? r.user
      : {};

  const studentId =
    s.id ??
    s.student_id ??
    s.user_id ??
    r.student_id ??
    r.user_id ??
    (typeof r.student === "number" ? r.student : null) ??
    r.id ??
    0;

  let studentName = "";
  if (typeof s === "object" && s !== null) {
    studentName = s.name ?? s.full_name ?? (s.first_name ? `${s.first_name} ${s.last_name ?? ""}`.trim() : "") ?? s.student_name ?? "";
  }
  if (!studentName) {
    studentName = r.student_name ?? r.user_name ?? r.name ?? (typeof r.student === "string" ? r.student : "") ?? `طالب #${studentId || 1}`;
  }

  const fullMark = Number(r.full_mark ?? r.test?.full_mark ?? 0);
  const studentMark = r.student_mark != null ? Number(r.student_mark) : r.mark != null ? Number(r.mark) : null;

  return {
    student: {
      id: Number(studentId),
      name: String(studentName),
    },
    student_mark: studentMark,
    full_mark: fullMark,
    result: r.result ?? (studentMark !== null && fullMark > 0 ? (studentMark >= fullMark * 0.5 ? "passed" : "failed") : null),
    student_attempt: Number(r.student_attempt ?? r.attempt ?? 1),
    submitted_at: r.submitted_at ?? r.created_at ?? null,
  };
}

function ResultBadge({ result }: { result: StudentResult["result"] }) {
  if (result === "passed")
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"><CheckCircle2 className="w-3 h-3 me-1" />ناجح</Badge>;
  if (result === "failed")
    return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0"><XCircle className="w-3 h-3 me-1" />راسب</Badge>;
  return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100 border-0"><Clock className="w-3 h-3 me-1" />معلق</Badge>;
}


// ─── Page ─────────────────────────────────────────────────

export default function InstructorTestResultsPage() {

  const { id = "" } = useParams();

  const { data: results = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["instructor-test-results", id],
    queryFn:  () => instructorTestsApi.getPendingForTest(id),
    enabled:  !!id,
  });

  const normalised = (results as any[]).map(normaliseResult);
  const total   = normalised.length;
  const passed  = normalised.filter((r) => r.result === "passed").length;
  const failed  = normalised.filter((r) => r.result === "failed").length;
  const pending = normalised.filter((r) => !r.result || r.result === "pending").length;
  const avgMark = total
    ? (normalised.reduce((s, r) => s + (r.student_mark ?? 0), 0) / total).toFixed(1)
    : "—";


  // ── Breadcrumb ────────────────────────────────────────────
  const headerContent = (
    <div className="flex items-center gap-2 text-sm min-w-0">
      <Link to="/teacher/tests" className="text-muted-foreground hover:text-foreground transition-colors">
        الاختبارات
      </Link>
      <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="font-semibold text-foreground truncate">نتائج الطلاب</span>
    </div>
  );

  const headerActions = (
    <Button size="sm" asChild>
      <Link to={`/teacher/tests/${id}/correction`}>
        <ClipboardEdit className="w-4 h-4 me-1.5" />
        تصحيح الإجابات
      </Link>
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
        <p className="text-destructive font-semibold">فشل تحميل النتائج</p>
        <Button variant="outline" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    </TeacherPageLayout>
  );


  // ── Render ────────────────────────────────────────────────
  return (
    <TeacherPageLayout headerContent={headerContent} headerActions={headerActions}>
      <div className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6" dir="rtl">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">

          {/* ── Summary Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "إجمالي المُسلِّمين", value: total,   icon: Users,        cls: "text-foreground" },
              { label: "الناجحون",           value: passed,  icon: CheckCircle2, cls: "text-emerald-600" },
              { label: "الراسبون",           value: failed,  icon: XCircle,      cls: "text-red-500" },
              { label: "متوسط الدرجات",      value: avgMark, icon: BarChart3,    cls: "text-primary" },
            ].map(({ label, value, icon: Icon, cls }, i) => (
              <motion.div
                key={`stat-card-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card p-4 shadow-xs"
              >
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium">{label}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <p className={cn("text-2xl font-bold", cls)}>{value}</p>
              </motion.div>
            ))}
          </div>


          {/* ── Pending banner if any ── */}
          {pending > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    يوجد {pending} إجابة تنتظر التصحيح اليدوي
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    قم بتصحيح الأسئلة المقالية لتحديث درجات الطلاب
                  </p>
                </div>
              </div>
              <Button size="sm" asChild className="shrink-0">
                <Link to={`/teacher/tests/${id}/correction`}>ابدأ التصحيح ←</Link>
              </Button>
            </div>
          )}


          {/* ── Results Table ── */}
          {total === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-foreground">لا توجد نتائج بعد</p>
              <p className="text-sm text-muted-foreground mt-1">لم يُسلّم أي طالب هذا الاختبار حتى الآن</p>
            </div>
          ) : (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>الطالب</TableHead>
                    <TableHead className="text-center">الدرجة</TableHead>
                    <TableHead className="text-center">النسبة</TableHead>
                    <TableHead className="text-center">المحاولات</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">تاريخ التسليم</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {results.map((raw: any, i: number) => {
                    const r = normaliseResult(raw);
                    const pct = r.full_mark
                      ? Math.round(((r.student_mark ?? 0) / r.full_mark) * 100)
                      : 0;
                    return (
                      <TableRow key={`student-result-${(r.student as any)?.id ?? i}-${i}`}>

                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>

                        <TableCell className="font-medium">{getName(r.student)}</TableCell>

                        <TableCell className="text-center font-semibold">
                          {r.student_mark !== null && r.student_mark !== undefined
                            ? <>{r.student_mark}<span className="text-muted-foreground font-normal"> / {r.full_mark}</span></>
                            : <span className="text-muted-foreground/40">—</span>
                          }
                        </TableCell>

                        <TableCell className="text-center">
                          {r.student_mark !== null && r.student_mark !== undefined ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className={cn(
                                "text-xs font-semibold",
                                pct >= 50 ? "text-emerald-600" : "text-red-500"
                              )}>
                                {pct}%
                              </span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${pct}%` }}
                                  className={cn("h-full rounded-full", pct >= 50 ? "bg-emerald-500" : "bg-red-500")}
                                />
                              </div>
                            </div>
                          ) : <span className="text-muted-foreground/40">—</span>}
                        </TableCell>

                        <TableCell className="text-center text-sm">{r.student_attempt ?? "—"}</TableCell>

                        <TableCell className="text-center">
                          <ResultBadge result={r.result} />
                        </TableCell>

                        <TableCell className="text-center text-xs text-muted-foreground">
                          {r.submitted_at
                            ? new Date(r.submitted_at).toLocaleDateString("ar-EG")
                            : "—"}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

            )}

          </motion.div>

        </div>
      </div>
    </TeacherPageLayout>
  );
}
