import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { fetchCategories } from "../api";
import type { Course } from "../types";

interface CourseFormProps {
  defaultValues?: Partial<CourseFormValues>;
  existingCover?: string | null;
  onSubmit: (data: CourseFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const LEVELS = [
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
] as const;

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

  const { data: categories = [] } = useQuery({
    queryKey: ["course-categories"],
    queryFn: fetchCategories,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as any, // eslint-disable-line
    defaultValues: {
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      categoryId: 0,
      coverImage: null,
      price: 0,
      level: "beginner",
      accessDurationDays: 30,
      totalDurationMinutes: 0,
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
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setValue("coverImage", null, { shouldValidate: true });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const err = (key: keyof CourseFormValues) => {
    const msg = errors[key]?.message;
    return msg ? <p className="text-sm font-medium text-destructive mt-1">{t(msg)}</p> : null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

      {/* ── Titles ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Title Arabic *</Label>
          <Input {...register("titleAr")} placeholder="عنوان الدورة" dir="rtl" aria-invalid={!!errors.titleAr} />
          {err("titleAr")}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Title English *</Label>
          <Input {...register("titleEn")} placeholder="Course title" aria-invalid={!!errors.titleEn} />
          {err("titleEn")}
        </div>
      </div>

      {/* ── Descriptions ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Description Arabic *</Label>
          <Textarea rows={3} {...register("descriptionAr")} placeholder="وصف الدورة" dir="rtl" />
          {err("descriptionAr")}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Description English *</Label>
          <Textarea rows={3} {...register("descriptionEn")} placeholder="Course description" />
          {err("descriptionEn")}
        </div>
      </div>

      {/* ── Category ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-category">Category *</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <select
              id="course-category"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              <option value={0}>Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        />
        {err("categoryId")}
      </div>

      {/* ── Cover Image ── */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-cover">{t("form.coverImage")}</Label>
        {previewUrl ? (
          <div className="relative h-40 w-full rounded-lg border overflow-hidden bg-muted">
            <img src={previewUrl} alt="cover" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={handleRemoveCover}
              className="absolute top-2 end-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
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
              "rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground",
              "hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors"
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <ImageOff className="size-5" />
            </div>
            <span className="text-sm font-medium">{t("form.uploadCover")}</span>
            <span className="text-xs">{t("form.uploadHint")}</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          id="course-cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        {previewUrl && (
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="self-start">
            <Upload className="size-3.5 me-2" />
            {t("form.changeImage")}
          </Button>
        )}
        <p className="text-xs text-muted-foreground">{t("form.imageRequirements")}</p>
        {errors.coverImage && (
          <p className="text-sm font-medium text-destructive">{t(String(errors.coverImage.message ?? ""))}</p>
        )}
      </div>

      {/* ── Price + Level ── */}
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
          {err("price")}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-level">Level *</Label>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <select
                id="course-level"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            )}
          />
          {err("level")}
        </div>
      </div>

      {/* ── Access Duration + Total Duration ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-access-days">Access Duration (days) *</Label>
          <Input
            id="course-access-days"
            type="number"
            min={1}
            placeholder="30"
            aria-invalid={!!errors.accessDurationDays}
            {...register("accessDurationDays", { valueAsNumber: true })}
          />
          {err("accessDurationDays")}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-total-minutes">Total Duration (minutes) *</Label>
          <Input
            id="course-total-minutes"
            type="number"
            min={1}
            placeholder="0"
            aria-invalid={!!errors.totalDurationMinutes}
            {...register("totalDurationMinutes", { valueAsNumber: true })}
          />
          {err("totalDurationMinutes")}
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
          {err("startDate")}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course-end-date">{t("form.endDate")}</Label>
          <Input
            id="course-end-date"
            type="date"
            aria-invalid={!!errors.endDate}
            {...register("endDate")}
          />
          {err("endDate")}
        </div>
      </div>

      {/* ── Allow Separate Lectures ── */}
      <Controller
        control={control as any} // eslint-disable-line
        name="allowSeparateLectures"
        render={({ field }) => (
          <div className="flex flex-row items-start justify-between gap-4 rounded-lg border p-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="course-allow-separate" className="text-base font-medium cursor-pointer">
                {t("form.allowSeparateLectures")}
              </Label>
              <p className="text-sm text-muted-foreground">{t("form.allowSeparateLecturesHint")}</p>
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
      <Button type="submit" id="course-form-submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("form.submitting") : (submitLabel ?? t("form.submit"))}
      </Button>
    </form>
  );
}

// ─── Helper: Map Course → Form Default Values ───
export function courseToFormValues(course: Course): Partial<CourseFormValues> {
  return {
    titleAr:          (course as any).title_ar          ?? (course as any).titleAr          ?? course.title,
    titleEn:          (course as any).title_en          ?? (course as any).titleEn          ?? course.title,
    descriptionAr:    (course as any).description_ar    ?? (course as any).descriptionAr    ?? course.description,
    descriptionEn:    (course as any).description_en    ?? (course as any).descriptionEn    ?? course.description,
    categoryId:       (course as any).category_id       ?? course.categoryId               ?? 0,
    price:            course.price,
    level:            course.level                                                          ?? "beginner",
    accessDurationDays:   (course as any).access_duration_days   ?? course.accessDurationDays   ?? 30,
    totalDurationMinutes: (course as any).total_duration_minutes ?? course.totalDurationMinutes ?? 0,
    startDate:        ((course as any).start_date ?? course.startDate ?? "").slice(0, 10),
    endDate:          ((course as any).end_date   ?? course.endDate   ?? "").slice(0, 10),
    allowSeparateLectures:
      (course as any).lectures_can_be_purchased_separately === 1  ||
      (course as any).lectures_can_be_purchased_separately === true ||
      course.allowSeparateLectures,
    coverImage: null,
  };
}
