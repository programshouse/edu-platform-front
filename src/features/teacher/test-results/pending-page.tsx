import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User, ClipboardList, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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


export default function PendingTestsPage() {

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["pending-tests"],
    queryFn:  instructorTestsApi.getPending,
  });

  if (isLoading) return (
    <TeacherPageLayout title="الإجابات المعلقة">
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    </TeacherPageLayout>
  );

  if (isError) return (
    <TeacherPageLayout title="الإجابات المعلقة">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-destructive font-semibold">فشل التحميل</p>
        <Button variant="outline" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    </TeacherPageLayout>
  );

  return (
    <TeacherPageLayout
      title="الإجابات المعلقة"
      subtitle={`${items.length} إجابة تنتظر التصحيح`}
    >
      <div className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6" dir="rtl">
        <div className="mx-auto max-w-7xl">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="font-semibold text-foreground">لا توجد إجابات معلقة</p>
              <p className="text-sm text-muted-foreground mt-1">جميع الإجابات تمت مراجعتها</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border bg-card shadow-sm overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>الطالب</TableHead>
                    <TableHead>الاختبار</TableHead>
                    <TableHead className="text-center">المحاولة</TableHead>
                    <TableHead className="text-center">تاريخ التسليم</TableHead>
                    <TableHead className="text-center">الدرجة الكاملة</TableHead>
                    <TableHead className="w-28"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(items as any[]).map((item, i) => (
                    <TableRow key={i}>

                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-medium text-sm">
                            {item.student?.name ?? item.student_name ?? "—"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {item.test?.title ?? item.title ?? `اختبار #${item.test?.id ?? item.id}`}
                          </p>
                          {item.test?.id && (
                            <p className="text-xs text-muted-foreground">#{item.test.id}</p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="secondary">#{item.student_attempt ?? 1}</Badge>
                      </TableCell>

                      <TableCell className="text-center text-xs text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.submitted_at
                            ? new Date(item.submitted_at).toLocaleDateString("ar-EG")
                            : "—"}
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-semibold">
                        {item.test?.full_mark ?? "—"}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button size="sm" asChild>
                          <Link to={`/teacher/tests/${item.test?.id ?? item.id}/correction`}>
                            تصحيح
                          </Link>
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}

        </div>
      </div>
    </TeacherPageLayout>
  );
}
