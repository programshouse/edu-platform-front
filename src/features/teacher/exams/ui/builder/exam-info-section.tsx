import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useCoursesQuery } from "@/features/teacher/courses/hooks/use-courses-query";

import type { ExamBuilderFormData } from "../../types";


export function ExamInfoSection() {
  const { t } = useTranslation("teacherExams");

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ExamBuilderFormData>();


  const {
    data,
    isLoading,
  } = useCoursesQuery();


  const courses = data?.data ?? [];

  const courseId = watch("courseId");


  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-4">
        {t("builder.info.title")}
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {/* Title */}
        <div className="flex flex-col gap-2 md:col-span-2">

          <Label htmlFor="title">
            {t("builder.info.examTitle")}
          </Label>


          <Input
            id="title"
            {...register("title")}
            placeholder={t("builder.info.examTitlePlaceholder")}
            aria-invalid={!!errors.title}
          />


          {errors.title && (
            <p className="text-sm text-destructive">
              {errors.title.message}
            </p>
          )}

        </div>



        {/* Course */}
        <div className="flex flex-col gap-2">

          <Label>
            {t("builder.info.course")}
          </Label>


          <Select
            value={courseId}
            onValueChange={(val) =>
              setValue("courseId", val)
            }
          >

            <SelectTrigger aria-invalid={!!errors.courseId}>

              <SelectValue
                placeholder={
                  t("builder.info.selectCourse")
                }
              />

            </SelectTrigger>



            <SelectContent>


              {isLoading && (
                <SelectItem
                  value="loading"
                  disabled
                >
                  Loading courses...
                </SelectItem>
              )}



              {!isLoading &&
                courses.length === 0 && (

                <SelectItem
                  value="empty"
                  disabled
                >
                  No courses found
                </SelectItem>

              )}



              {courses.map((course: any) => (

                <SelectItem
                  key={course.id}
                  value={String(course.id)}
                >
                  {
                    course.title_en ??
                    course.title ??
                    course.name
                  }
                </SelectItem>

              ))}


            </SelectContent>

          </Select>



          {errors.courseId && (
            <p className="text-sm text-destructive">
              {errors.courseId.message}
            </p>
          )}

        </div>





        {/* Duration */}
        <div className="flex flex-col gap-2">

          <Label htmlFor="durationMins">
            {t("builder.info.duration")}
          </Label>


          <Input
            id="durationMins"
            type="number"
            {...register(
              "durationMins",
              {
                valueAsNumber: true,
              }
            )}
            aria-invalid={!!errors.durationMins}
          />


          {errors.durationMins && (
            <p className="text-sm text-destructive">
              {errors.durationMins.message}
            </p>
          )}

        </div>





        {/* Attempts */}
        <div className="flex flex-col gap-2">

          <Label htmlFor="attemptsAllowed">
            {t("builder.info.attempts")}
          </Label>


          <Input
            id="attemptsAllowed"
            type="number"
            {...register(
              "attemptsAllowed",
              {
                valueAsNumber: true,
              }
            )}
            aria-invalid={!!errors.attemptsAllowed}
          />


          {errors.attemptsAllowed && (
            <p className="text-sm text-destructive">
              {errors.attemptsAllowed.message}
            </p>
          )}

        </div>





        {/* Passing Grade */}
        <div className="flex flex-col gap-2">

          <Label htmlFor="passingGrade">
            {t("builder.info.passingGrade")}
          </Label>


          <Input
            id="passingGrade"
            type="number"
            {...register(
              "passingGrade",
              {
                valueAsNumber: true,
              }
            )}
            placeholder={
              t(
                "builder.info.passingGradePlaceholder"
              )
            }
            aria-invalid={!!errors.passingGrade}
          />


          {errors.passingGrade && (
            <p className="text-sm text-destructive">
              {errors.passingGrade.message}
            </p>
          )}

        </div>


      </div>

    </div>
  );
}