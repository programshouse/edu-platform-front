import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { TeacherPageLayout } from "../../../components/teacher-page-layout";
import { useExamBuilder } from "../../hooks";
import { ExamInfoSection } from "./exam-info-section";
import { ExamSettingsSection } from "./exam-settings-section";
import { QuestionsBuilderSection } from "./questions-builder-section";

export function ExamBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("teacherExams");

  const { form, onSubmit, isSaving, isLoadingExam } = useExamBuilder(id);

  const isRtl = i18n.language === "ar";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  if (isEditMode && isLoadingExam) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <TeacherPageLayout
        headerContent={
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/teacher/exams")}
              className="size-8 text-muted-foreground hover:text-foreground shrink-0"
            >
              <BackIcon className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <h1 className="text-sm font-semibold leading-tight text-foreground truncate">
              {isEditMode ? t("builder.editTitle") : t("builder.createTitle")}
            </h1>
          </div>
        }
        headerActions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/teacher/exams")}
              disabled={isSaving}
            >
              {t("builder.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="size-4 me-2 animate-spin" />}
              <Save className="size-4 me-2" />
              {t("builder.save")}
            </Button>
          </>
        }
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative min-h-full pb-20"
        >
          {/* ── Main Content Area ── */}
          <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
            {/* Section 1: Exam Info */}
            <section id="exam-info">
              <ExamInfoSection />
            </section>

            {/* Section 2: Questions Builder */}
            <section id="questions-builder">
              <QuestionsBuilderSection />
              {form.formState.errors.questions?.root && (
                <p className="text-sm text-destructive mt-2 text-center bg-destructive/10 p-2 rounded">
                  {form.formState.errors.questions.root.message}
                </p>
              )}
            </section>

            {/* Section 3: Exam Settings */}
            <section id="exam-settings">
              <ExamSettingsSection />
            </section>
          </main>
        </form>
      </TeacherPageLayout>
    </FormProvider>
  );
}
