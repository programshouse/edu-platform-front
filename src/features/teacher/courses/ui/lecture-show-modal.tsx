import { useTranslation } from "react-i18next";
import {
  Video,
  Radio,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  BookOpen,
  FileQuestion,
  FileText,
  Pencil,
  X,
  PlayCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { LectureItem } from "../api";

interface LectureShowModalProps {
  lecture: LectureItem | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (lecture: LectureItem) => void;
}

export function LectureShowModal({
  lecture,
  open,
  onClose,
  onEdit,
}: LectureShowModalProps) {
  const { t, i18n } = useTranslation("teacherCourses");
  const isAr = i18n.language.startsWith("ar");

  if (!lecture) return null;

  const title =
    (isAr ? lecture.title_ar : lecture.title_en) ||
    lecture.title ||
    lecture.title_en ||
    lecture.title_ar ||
    "";

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) {
      return isAr ? `${h} ساعة ${m > 0 ? `و ${m} دقيقة` : ""}` : `${h}h ${m > 0 ? `${m}m` : ""}`;
    }
    return isAr ? `${m} دقيقة` : `${m}m`;
  };

  const isRecorded = lecture.lecture_type === "recorded";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b bg-muted/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {isRecorded ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <Radio className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold truncate">
                  {title}
                </DialogTitle>
                {lecture.course_title && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {lecture.course_title}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={lecture.is_free ? "default" : "secondary"} className="gap-1 text-xs">
                {lecture.is_free ? (
                  <>
                    <Unlock className="w-3 h-3 text-emerald-300" />
                    {t("lectures.free", "Free")}
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-muted-foreground" />
                    {t("lectures.paid", "Paid")}
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium">
                {t(`lectures.types.${lecture.lecture_type}`, lecture.lecture_type)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Video Preview / Player */}
          {lecture.video_url ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("lectures.videoPreview", "Video Preview")}
              </label>
              <div className="overflow-hidden rounded-xl border bg-black shadow-sm aspect-video relative flex items-center justify-center">
                <video
                  src={lecture.video_url}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 bg-muted/10 flex flex-col items-center justify-center text-center gap-2.5">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {isRecorded
                    ? t("lectures.types.recorded", "Recorded Lecture")
                    : t("lectures.types.live", "Live Session")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("lectures.noVideo", "No direct video URL uploaded yet")}
                </p>
              </div>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-card p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{t("lectures.duration", "Duration")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {formatDuration(lecture.duration_minutes)}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {lecture.is_free ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>{t("lectures.access", "Access")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {lecture.is_free
                  ? t("lectures.accessFree", "Free Preview")
                  : t("lectures.accessPaid", "Enrolled Only")}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileQuestion className="w-3.5 h-3.5 text-blue-500" />
                <span>{t("lectures.tests", "Tests")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {lecture.tests_count ?? 0}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>{t("lectures.homeworks", "Homeworks")}</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {lecture.homeworks_count ?? 0}
              </p>
            </div>
          </div>

          {/* Bilingual Titles Breakdown if available */}
          {(lecture.title_en || lecture.title_ar) && (
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>{t("lectures.details", "Lecture Information")}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {lecture.title_en && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">English Title</span>
                    <p className="font-medium text-foreground">{lecture.title_en}</p>
                  </div>
                )}
                {lecture.title_ar && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">العنوان بالعربية</span>
                    <p className="font-medium text-foreground" dir="rtl">{lecture.title_ar}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 border-t bg-muted/20 flex items-center justify-between sm:justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5">
            <X className="w-4 h-4" />
            {t("actions.close", "Close")}
          </Button>

          {onEdit && (
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(lecture);
              }}
              className="gap-1.5"
            >
              <Pencil className="w-4 h-4" />
              {t("lectures.editTitle", "Edit Lecture")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
