import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Upload, X, ImageOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { courseFormSchema, type CourseFormValues } from "../model/course-schema";
import type { Course } from "../types";

interface CourseFormProps {
  defaultValues?: Partial<CourseFormValues>;
  existingCover?: string | null;
  onSubmit: (data: CourseFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function CourseForm({
  defaultValues,
  existingCover,
  onSubmit,
  isSubmitting,
  submitLabel,
}: CourseFormProps) {
  const { t } = useTranslation("teacherCourses");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingCover ?? null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      title: "",
      description: "",
      coverImage: null,
      price: 0,
      durationDays: 30,
      startDate: "",
      endDate: "",
      allowSeparateLectures: false,
      ...defaultValues,
    },
    mode: "onBlur",
  });

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setValue("coverImage", file, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveCover = () => {
    setValue("coverImage", null, { shouldValidate: true });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getError = (key: keyof CourseFormValues) => {
    const msg = errors[key]?.message;
    if (!msg) return null;
    return <p className="text-sm font-medium text-destructive mt-1">{t(msg)}</p>;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* ── Title ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-title">{t("form.title")} *</Label>
        <Input
          id="course-title"
          placeholder={t("form.titlePlaceholder")}
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {getError("title")}
      </div>

      {/* ── Description ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-description">{t("form.description")} *</Label>
        <Textarea
          id="course-description"
          placeholder={t("form.descriptionPlaceholder")}
          rows={4}
          className="resize-none"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {getError("description")}
      </div>

      {/* ── Cover Image ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-cover">{t("form.coverImage")}</Label>

        {previewUrl ? (
          <div className="relative h-40 w-full rounded-lg border border-border overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt={t("form.coverPreview")}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveCover}
              className="absolute top-2 inset-e-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label={t("form.removeCover")}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2",
              "rounded-lg border-2 border-dashed border-muted-foreground/30",
              "text-muted-foreground transition-colors",
              "hover:border-primary/50 hover:text-primary hover:bg-primary/5"
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <ImageOff className="size-5" />
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-sm font-medium">{t("form.uploadCover")}</span>
              <span className="text-xs">{t("form.uploadHint")}</span>
            </div>
          </button>
        )}

        <input
          ref={fileInputRef}
          id="course-cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          aria-label={t("form.coverImage")}
        />

        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="self-start"
          >
            <Upload className="size-3.5 me-2" />
            {t("form.changeImage")}
          </Button>
        )}

        <p className="text-xs text-muted-foreground">{t("form.imageRequirements")}</p>
        {errors.coverImage && (
          <p className="text-sm font-medium text-destructive">{t(String(errors.coverImage.message ?? ""))}</p>
        )}
      </div>

      {/* ── Price + Duration ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-price">{t("form.price")} *</Label>
          <Input
            id="course-price"
            type="number"
            min={0}
            step={0.01}
            placeholder="0"
            aria-invalid={!!errors.price}
            {...register("price", { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground">{t("form.priceHint")}</p>
          {getError("price")}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-duration">{t("form.durationDays")} *</Label>
          <Input
            id="course-duration"
            type="number"
            min={1}
            placeholder="30"
            aria-invalid={!!errors.durationDays}
            {...register("durationDays", { valueAsNumber: true })}
          />
          {getError("durationDays")}
        </div>
      </div>

      {/* ── Start + End Date ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-start-date">{t("form.startDate")} *</Label>
          <Input
            id="course-start-date"
            type="date"
            aria-invalid={!!errors.startDate}
            {...register("startDate")}
          />
          {getError("startDate")}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-end-date">{t("form.endDate")} *</Label>
          <Input
            id="course-end-date"
            type="date"
            aria-invalid={!!errors.endDate}
            {...register("endDate")}
          />
          {getError("endDate")}
        </div>
      </div>

      {/* ── Allow Separate Lectures ── */}
      <Controller
        control={control as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        name="allowSeparateLectures"
        render={({ field }) => (
          <div className="flex flex-row items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="course-allow-separate" className="text-base font-medium cursor-pointer">
                {t("form.allowSeparateLectures")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("form.allowSeparateLecturesHint")}
              </p>
            </div>
            <Switch
              id="course-allow-separate"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      {/* ── Submit ── */}
      <Button
        type="submit"
        id="course-form-submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t("form.submitting") : (submitLabel ?? t("form.submit"))}
      </Button>
    </form>
  );
}

// ─── Helper: Map Course → Form Default Values ───
export function courseToFormValues(course: Course): Partial<CourseFormValues> {
  return {
    title: course.title,
    description: course.description,
    price: course.price,
    durationDays: course.durationDays,
    startDate: course.startDate?.slice(0, 10) ?? "",
    endDate: course.endDate?.slice(0, 10) ?? "",
    allowSeparateLectures: course.allowSeparateLectures,
    coverImage: null,
  };
}
