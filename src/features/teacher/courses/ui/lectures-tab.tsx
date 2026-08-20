import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Video, Radio } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { useCourseContentStore } from "../model/course-content-store";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CoursesEmptyState } from "./courses-empty-error";
import { AddLectureModal } from "./add-lecture-modal";

export function LecturesTab() {
  const { t } = useTranslation("teacherCourses");
  const lectures = useCourseContentStore((s) => s.lectures);
  const isLoading = useCourseContentStore((s) => s.isLoadingLectures);
  const openLectureModal = useCourseContentStore((s) => s.openLectureModal);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("lectures.title", "Lectures")}</h3>
        <Button onClick={() => openLectureModal()} size="sm">
          <Plus className="size-4 me-2" />
          {t("lectures.add", "Add Lecture")}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">{t("lectures.name", "Title")}</TableHead>
              <TableHead>{t("lectures.type", "Type")}</TableHead>
              <TableHead>{t("lectures.duration", "Duration")}</TableHead>
              <TableHead>{t("lectures.status", "Status")}</TableHead>
              <TableHead className="text-end">{t("lectures.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[60px] rounded-full" /></TableCell>
                  <TableCell className="text-end"><Skeleton className="h-8 w-[60px] inline-block" /></TableCell>
                </TableRow>
              ))
            ) : lectures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground hover:bg-transparent">
                  <CoursesEmptyState />
                </TableCell>
              </TableRow>
            ) : (
              lectures.map((lecture) => (
                <TableRow key={lecture.id}>
                  <TableCell className="font-medium">{lecture.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {lecture.type === "video" ? (
                        <Video className="size-4 text-muted-foreground" />
                      ) : (
                        <Radio className="size-4 text-blue-500" />
                      )}
                      <span className="capitalize">{t(`lectures.types.${lecture.type}`, lecture.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lecture.duration}</TableCell>
                  <TableCell>
                    <Badge variant={lecture.status === "visible" ? "default" : "secondary"}>
                      {t(`lectures.statuses.${lecture.status}`, lecture.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openLectureModal(lecture)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AddLectureModal />
    </div>
  );
}
