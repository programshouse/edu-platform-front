import { z } from "zod";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

// ─── Create / Edit Course Schema ───
export const courseFormSchema = z
  .object({
    titleAr: z.string().min(3, { message: "validation.titleMin" }).max(150, { message: "validation.titleMax" }),
    titleEn: z.string().min(3, { message: "validation.titleMin" }).max(150, { message: "validation.titleMax" }),

    descriptionAr: z.string().min(10, { message: "validation.descriptionMin" }).max(2000, { message: "validation.descriptionMax" }),
    descriptionEn: z.string().min(10, { message: "validation.descriptionMin" }).max(2000, { message: "validation.descriptionMax" }),

    categoryId: z
      .number({ error: "validation.categoryRequired" })
      .min(1, { message: "validation.categoryRequired" }),

    coverImage: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, { message: "validation.imageSizeMax" })
      .refine((file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), { message: "validation.imageType" }),

    price: z
      .number({ error: "validation.priceRequired" })
      .min(0, { message: "validation.priceMin" })
      .max(100000, { message: "validation.priceMax" }),

    level: z.enum(LEVELS, { error: "validation.levelRequired" }),

    accessDurationDays: z
      .number({ error: "validation.durationRequired" })
      .int({ message: "validation.durationInt" })
      .min(1, { message: "validation.durationMin" })
      .max(3650, { message: "validation.durationMax" }),

    totalDurationMinutes: z
      .number({ error: "validation.totalDurationRequired" })
      .int({ message: "validation.durationInt" })
      .min(1, { message: "validation.durationMin" }),

    startDate: z.string().min(1, { message: "validation.startDateRequired" }),

    endDate: z.string().optional().default(""),

    allowSeparateLectures: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    { message: "validation.endDateAfterStart", path: ["endDate"] }
  );

export type CourseFormValues = z.infer<typeof courseFormSchema>;

// ─── Filters Schema ───
export const coursesFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.enum(["active", "inactive", "finished", ""]).default(""),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  dateFrom: z.string().default(""),
  dateTo: z.string().default(""),
});

export type CoursesFiltersValues = z.infer<typeof coursesFiltersSchema>;
