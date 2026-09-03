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
  return {
    student:         r.student ?? { id: r.student_id ?? 0, name: r.student_name ?? "—" },
    student_mark:    r.student_mark ?? r.mark ?? null,
    full_mark:       r.full_mark ?? r.test?.full_mark ?? 0,
    result:          r.result ?? null,
    student_attempt: r.student_attempt ?? 1,
    submitted_at:    r.submitted_at ?? null,
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

  const headerActions = pending > 0 ? (
    <Button size="sm" asChild>
      <Link to={`/teacher/tests/${id}/correction`}>
        <ClipboardEdit className="w-4 h-4 me-1.5" />
        تصحيح ({pending} معلق)
      </Link>
    </Button>
  ) : undefined;


  // ── Loading / Error ───────────────────────────────────────
  if (isLoading) return (
    <TeacherPageLayout headerContent={headerContent}>
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    </TeacherPageLayout>
  );

  if (isError) return (
    <TeacherPageLayout headerContent={headerContent}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-destructive font-semibold">فشل تحميل النتائج</p>
        <Button variant="outline" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    </TeacherPageLayout>
  );


  // ── Main ─────────────────────────────────────────────────
  return (
    <TeacherPageLayout headerContent={headerContent} headerActions={headerActions}>
      <div className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6" dir="rtl">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">


          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "إجمالي الطلاب", value: total,   icon: Users,        cls: "bg-blue-50   text-blue-600"   },
              { label: "ناجح",           value: passed,  icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-600" },
              { label: "راسب",           value: failed,  icon: XCircle,      cls: "bg-red-50    text-red-500"    },
              { label: "متوسط الدرجات", value: avgMark, icon: BarChart3,    cls: "bg-violet-50  text-violet-600" },
            ].map(({ label, value, icon: Icon, cls }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card shadow-sm p-5 flex items-center gap-4"
              >
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", cls)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>


          {/* ── Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border bg-card shadow-sm overflow-hidden"
          >

            {results.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-12 h-12 text-muted-foreground/20 mb-3" />
                <p className="font-medium text-muted-foreground">لا توجد نتائج بعد</p>
                <p className="text-sm text-muted-foreground/60 mt-1">لم يُسلّم أي طالب هذا الاختبار</p>
              </div>

            ) : (

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
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
                      <TableRow key={i}>

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
