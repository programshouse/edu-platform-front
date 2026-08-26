import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCourseContentStore } from "../model/course-content-store";
import { createLecture, updateLecture } from "../api";

// ─── Schema ───
const lectureSchema = z.object({
  titleEn:         z.string().min(2, "Title EN is required"),
  titleAr:         z.string().min(2, "Title AR is required"),
  lectureType:     z.enum(["recorded", "live"]),
  video:           z.instanceof(File).optional().nullable(),
  durationMinutes: z.number().int().min(1, "Duration required"),
  isFree:          z.boolean().default(false),
});

type LectureFormValues = z.infer<typeof lectureSchema>;

export function AddLectureModal() {
  const { t } = useTranslation("teacherCourses");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient  = useQueryClient();

  const isOpen        = useCourseContentStore((s) => s.isAddLectureModalOpen);
  const editingLecture = useCourseContentStore((s) => s.editingLecture);
  const closeLectureModal = useCourseContentStore((s) => s.closeLectureModal);
  const courseId      = useCourseContentStore((s) => s.courseId);

  const isEditing = !!editingLecture;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LectureFormValues>({
    resolver: zodResolver(lectureSchema) as any, // eslint-disable-line
    defaultValues: {
      titleEn: "",
      titleAr: "",
      lectureType: "recorded",
      video: null,
      durationMinutes: 0,
      isFree: false,
    },
  });

  const lectureType = watch("lectureType");

  // Populate form when editing
  useEffect(() => {
    if (isOpen && editingLecture) {
      reset({
        titleEn:         editingLecture.title_en ?? editingLecture.title,
        titleAr:         editingLecture.title_ar ?? editingLecture.title,
        lectureType:     editingLecture.lecture_type,
        video:           null,
        durationMinutes: editingLecture.duration_minutes,
        isFree:          editingLecture.is_free,
      });
    } else if (isOpen) {
      reset({
        titleEn: "", titleAr: "", lectureType: "recorded",
        video: null, durationMinutes: 0, isFree: false,
      });
    }
  }, [isOpen, editingLecture, reset]);

  // ─── Mutations ───
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: (data: LectureFormValues) =>
      createLecture(courseId!, {
        titleEn:         data.titleEn,
        titleAr:         data.titleAr,
        lectureType:     data.lectureType,
        video:           data.video ?? undefined,
        durationMinutes: data.durationMinutes,
        isFree:          data.isFree ? 1 : 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "course", courseId, "lectures"] });
      toast.success(t("lectures.created", "Lecture added"));
      closeLectureModal();
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? t("notifications.error", "Something went wrong"));
    },
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (data: LectureFormValues) =>
      updateLecture(editingLecture!.id, {
        titleEn:         data.titleEn,
        titleAr:         data.titleAr,
        lectureType:     data.lectureType,
        video:           data.video ?? undefined,
        durationMinutes: data.durationMinutes,
        isFree:          data.isFree ? 1 : 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "course", courseId, "lectures"] });
      toast.success(t("lectures.updated", "Lecture updated"));
      closeLectureModal();
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? t("notifications.error", "Something went wrong"));
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: LectureFormValues) => {
    if (isEditing) {
      update(data);
    } else {
      if (!courseId) { toast.error("Course ID missing"); return; }
      create(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeLectureModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("lectures.editTitle", "Edit Lecture")
              : t("lectures.addTitle", "Add New Lecture")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2" noValidate>

          {/* ── Titles ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Title English *</Label>
              <Input {...register("titleEn")} placeholder="Lecture title" aria-invalid={!!errors.titleEn} />
              {errors.titleEn && <p className="text-xs text-destructive">{errors.titleEn.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Title Arabic *</Label>
              <Input {...register("titleAr")} placeholder="عنوان المحاضرة" dir="rtl" aria-invalid={!!errors.titleAr} />
              {errors.titleAr && <p className="text-xs text-destructive">{errors.titleAr.message}</p>}
            </div>
          </div>

          {/* ── Type ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Lecture Type *</Label>
            <Controller
              control={control}
              name="lectureType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recorded">{t("lectures.types.recorded", "Recorded")}</SelectItem>
                    <SelectItem value="live">{t("lectures.types.live", "Live")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* ── Video (only for recorded) ── */}
          {lectureType === "recorded" && (
            <div className="flex flex-col gap-1.5">
              <Label>Video File {!isEditing && "*"}</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setValue("video", file, { shouldValidate: true });
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t("form.uploadCover", "Choose file")}
                </Button>
                <span className="text-sm text-muted-foreground self-center">
                  {watch("video")?.name ?? (isEditing ? "No new file selected" : "No file chosen")}
                </span>
              </div>
            </div>
          )}

          {/* ── Duration ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Duration (minutes) *</Label>
            <Input
              type="number"
              min={1}
              placeholder="60"
              aria-invalid={!!errors.durationMinutes}
              {...register("durationMinutes", { valueAsNumber: true })}
            />
            {errors.durationMinutes && <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>}
          </div>

          {/* ── Is Free ── */}
          <Controller
            control={control as any} // eslint-disable-line
            name="isFree"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="text-base font-medium">Free Preview</Label>
                  <p className="text-sm text-muted-foreground">Allow non-enrolled students to watch</p>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={closeLectureModal} disabled={isPending}>
              {t("actions.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("form.submitting", "Saving…")
                : isEditing
                  ? t("actions.save", "Update")
                  : t("lectures.add", "Add Lecture")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
