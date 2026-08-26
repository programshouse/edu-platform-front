import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { fetchExamDetails } from "../api";
import { examBuilderSchema, type ExamBuilderFormData } from "../types";
import { useSaveExam } from "./use-save-exam";

const emptyDefaults: ExamBuilderFormData = {
  title: "",
  courseId: "",
  durationMins: 60,
  attemptsAllowed: 1,
  passingGrade: null,
  status: "draft",
  questions: [],
  settings: {
    questionOrder:     "fixed",
    shuffleAnswers:    false,
    timeBehavior:      "start_on_attempt",
    availabilityStart: null,
    availabilityEnd:   null,
    attemptsLogic:     "highest",
    resultVisibility:  "immediately",
    essayHandling:     "wait_manual",
  },
};

export function useExamBuilder(examId?: string) {
  const { mutate: saveExam, isPending: isSaving } = useSaveExam(examId);

  // ── Fetch existing exam when editing ──
  const { data: examData, isLoading: isLoadingExam } = useQuery({
    queryKey: ["teacher", "exam", examId],
    queryFn:  () => fetchExamDetails(examId!),
    enabled:  !!examId,
    staleTime: 0, // always re-fetch on mount in edit mode
  });

  // ── Build default values ──
  // For edit: use fetched data once available (avoids empty flash)
  // For create: use empty defaults immediately
  const resolvedDefaults: ExamBuilderFormData =
    examId && examData
      ? {
          title:           examData.title,
          courseId:        examData.courseId,
          durationMins:    examData.durationMins,
          attemptsAllowed: examData.attemptsAllowed,
          passingGrade:    examData.passingGrade ?? null,
          status:          examData.status,
          questions:       examData.questions ?? [],
          settings:        examData.settings ?? emptyDefaults.settings,
        }
      : emptyDefaults;

  const form = useForm<ExamBuilderFormData>({
    resolver:      zodResolver(examBuilderSchema),
    defaultValues: resolvedDefaults,
  });

  // ── Reset form when data arrives (handles page reload / cache miss) ──
  useEffect(() => {
    if (examData) {
      form.reset({
        title:           examData.title,
        courseId:        examData.courseId,
        durationMins:    examData.durationMins,
        attemptsAllowed: examData.attemptsAllowed,
        passingGrade:    examData.passingGrade ?? null,
        status:          examData.status,
        questions:       examData.questions ?? [],
        settings:        examData.settings ?? emptyDefaults.settings,
        // carry totalGrade so examToForm can use it as full_mark fallback
        totalGrade:      examData.totalGrade,
      } as any);
    }
  }, [examData]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (data: ExamBuilderFormData) => {
    saveExam(data);
  };

  return {
    form,
    onSubmit,
    isSaving,
    isLoadingExam: !!examId && isLoadingExam,
  };
}
