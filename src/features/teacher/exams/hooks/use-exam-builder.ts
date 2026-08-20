import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { fetchExamDetails } from "../api";
import { examBuilderSchema, type ExamBuilderFormData } from "../types";
import { useSaveExam } from "./use-save-exam";

const defaultValues: ExamBuilderFormData = {
  title: "",
  courseId: "",
  durationMins: 60,
  attemptsAllowed: 1,
  passingGrade: null,
  status: "draft",
  questions: [],
  settings: {
    questionOrder: "fixed",
    shuffleAnswers: false,
    timeBehavior: "start_on_attempt",
    availabilityStart: null,
    availabilityEnd: null,
    attemptsLogic: "highest",
    resultVisibility: "immediately",
    essayHandling: "wait_manual",
  },
};

export function useExamBuilder(examId?: string) {
  const { mutate: saveExam, isPending: isSaving } = useSaveExam(examId);

  const form = useForm<ExamBuilderFormData>({
    resolver: zodResolver(examBuilderSchema),
    defaultValues,
  });

  const { data: initialData, isLoading: isLoadingExam } = useQuery({
    queryKey: ["teacher", "exam", examId],
    queryFn: () => fetchExamDetails(examId!),
    enabled: !!examId,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        courseId: initialData.courseId,
        durationMins: initialData.durationMins,
        attemptsAllowed: initialData.attemptsAllowed,
        passingGrade: initialData.passingGrade,
        status: initialData.status,
        questions: initialData.questions,
        settings: initialData.settings,
      });
    }
  }, [initialData, form]);

  const onSubmit = (data: ExamBuilderFormData) => {
    saveExam(data);
  };

  return {
    form,
    onSubmit,
    isSaving,
    isLoadingExam,
  };
}
