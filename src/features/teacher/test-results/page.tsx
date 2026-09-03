import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Users, Loader2, AlertCircle, ChevronLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TeacherPageLayout } from "../components/teacher-page-layout";
import { instructorTestsApi } from "./api";


export default function InstructorTestsPage() {

  const { data: tests = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["instructor-tests"],
    queryFn:  instructorTestsApi.getTests,
  });

  if (isLoading) return (
    <TeacherPageLayout title="الاختبارات">
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    </TeacherPageLayout>
  );

  if (isError) return (
    <TeacherPageLayout title="الاختبارات">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-destructive font-semibold">فشل تحميل الاختبارات</p>
        <Button variant="outline" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    </TeacherPageLayout>
  );

  return (
    <TeacherPageLayout title="الاختبارات" subtitle="إدارة اختباراتك ونتائج الطلاب">
      <div className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6" dir="rtl">
        <div className="mx-auto max-w-7xl">

          {tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ClipboardList className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="font-medium text-muted-foreground">لا توجد اختبارات</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {(tests as any[]).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border bg-card shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">#{t.id}</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground leading-snug">
                      {t.title ?? t.title_ar ?? t.title_en ?? `اختبار ${t.id}`}
                    </h3>
                    {t.course_title && (
                      <p className="text-xs text-muted-foreground mt-1">{t.course_title}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {t.full_mark && (
                      <span className="flex items-center gap-1">
                        <ClipboardList className="w-3 h-3" />
                        الدرجة الكاملة: {t.full_mark}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto pt-2 border-t">
                    <Button size="sm" className="flex-1" asChild>
                      <Link to={`/teacher/tests/${t.id}/results`}>
                        <Users className="w-3.5 h-3.5 me-1.5" />
                        النتائج
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link to={`/teacher/tests/${t.id}/correction`}>
                        <ChevronLeft className="w-3.5 h-3.5 me-1.5" />
                        تصحيح
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>
    </TeacherPageLayout>
  );
}
