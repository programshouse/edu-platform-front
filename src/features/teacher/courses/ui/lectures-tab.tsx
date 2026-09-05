import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Video, Radio, Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CoursesEmptyState } from "./courses-empty-error";
import { AddLectureModal } from "./add-lecture-modal";
import { LectureShowModal } from "./lecture-show-modal";
import { useCourseContentStore } from "../model/course-content-store";
import { deleteLecture, type LectureItem } from "../api";

export function LecturesTab() {
  const { t } = useTranslation("teacherCourses");
  const queryClient = useQueryClient();

  const lectures          = useCourseContentStore((s) => s.lectures);
  const isLoading         = useCourseContentStore((s) => s.isLoadingLectures);
  const openLectureModal  = useCourseContentStore((s) => s.openLectureModal);
  const courseId          = useCourseContentStore((s) => s.courseId);

  const [selectedLecture, setSelectedLecture] = useState<LectureItem | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);

  const handleShowLecture = (lecture: LectureItem) => {
    setSelectedLecture(lecture);
    setIsShowModalOpen(true);
  };

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteLecture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "course", courseId, "lectures"] });
      toast.success(t("lectures.deleted", "Lecture deleted"));
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? t("notifications.error", "Something went wrong"));
    },
  });

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

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
              <TableHead>{t("lectures.status", "Free")}</TableHead>
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
                  <TableCell className="text-end"><Skeleton className="h-8 w-[80px] inline-block" /></TableCell>
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
                      {lecture.lecture_type === "recorded" ? (
                        <Video className="size-4 text-muted-foreground" />
                      ) : (
                        <Radio className="size-4 text-blue-500" />
                      )}
                      <span className="capitalize">
                        {t(`lectures.types.${lecture.lecture_type}`, lecture.lecture_type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDuration(lecture.duration_minutes)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={lecture.is_free ? "default" : "secondary"}>
                      {lecture.is_free ? t("lectures.free", "Free") : t("lectures.paid", "Paid")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("lectures.show", "Show Lecture")}
                        onClick={() => handleShowLecture(lecture)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("lectures.editTitle", "Edit Lecture")}
                        onClick={() => openLectureModal(lecture)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("actions.delete", "Delete")}
                        className="text-destructive hover:text-destructive"
                        disabled={isDeleting}
                        onClick={() => remove(lecture.id)}
                      >
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

      <LectureShowModal
        lecture={selectedLecture}
        open={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        onEdit={(lec) => openLectureModal(lec)}
      />
    </div>
  );
}
