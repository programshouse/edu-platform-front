import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { ExamBuilderFormData } from "../../types";

interface QuestionEditorProps {
  index: number;
  onClose: () => void;
}

export function QuestionEditor({ index, onClose }: QuestionEditorProps) {
  const { t } = useTranslation("teacherExams");
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ExamBuilderFormData>();

  const type = watch(`questions.${index}.type`);
  const correctAnswer = watch(`questions.${index}.correctAnswer`);
  const questionErrors = errors.questions?.[index];

  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    name: `questions.${index}.options`,
  });

  const handleAddOption = () => {
    appendOption({ id: `opt-${Date.now()}`, text: "" });
  };

  return (
    <div className="bg-muted/30 border border-primary/20 rounded-lg p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-primary">
          {t("builder.questions.editing")}
        </h4>
        <Button variant="default" size="sm" onClick={onClose}>
          {t("builder.questions.done")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
        {/* Question Text */}
        <div className="flex flex-col gap-2">
          <Label>{t("builder.questions.questionText")}</Label>
          <Input
            {...register(`questions.${index}.text`)}
            placeholder={t("builder.questions.textPlaceholder")}
            aria-invalid={!!questionErrors?.text}
          />
          {questionErrors?.text && (
            <p className="text-xs text-destructive">
              {questionErrors.text.message}
            </p>
          )}
        </div>

        {/* Points */}
        <div className="flex flex-col gap-2">
          <Label>{t("builder.questions.points")}</Label>
          <Input
            type="number"
            {...register(`questions.${index}.points`, { valueAsNumber: true })}
            aria-invalid={!!questionErrors?.points}
          />
          {questionErrors?.points && (
            <p className="text-xs text-destructive">
              {questionErrors.points.message}
            </p>
          )}
        </div>
      </div>

      {/* Type Specific Fields */}
      {type === "mcq" && (
        <div className="flex flex-col gap-3 mt-2 p-4 bg-background rounded-md border border-border">
          <Label className="mb-1">{t("builder.questions.options")}</Label>

          <RadioGroup
            value={correctAnswer || ""}
            onValueChange={(val) =>
              setValue(`questions.${index}.correctAnswer`, val, {
                shouldValidate: true,
              })
            }
            className="flex flex-col gap-3"
          >
            {options.map((opt, optIndex) => (
              <div key={opt.id} className="flex items-center gap-3">
                <RadioGroupItem
                  value={opt.id}
                  id={`q-${index}-opt-${optIndex}`}
                />
                <Input
                  {...register(`questions.${index}.options.${optIndex}.text`)}
                  placeholder={`${t("builder.questions.option")} ${optIndex + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeOption(optIndex)}
                  disabled={options.length <= 2}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </RadioGroup>

          {questionErrors?.options && (
            <p className="text-xs text-destructive">
              {t("builder.questions.optionsError")}
            </p>
          )}
          {questionErrors?.correctAnswer && (
            <p className="text-xs text-destructive">
              {t("builder.questions.correctAnswerError")}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit mt-2"
            onClick={handleAddOption}
          >
            <Plus className="size-3.5 me-1.5" />
            {t("builder.questions.addOption")}
          </Button>
        </div>
      )}

      {type === "tf" && (
        <div className="flex flex-col gap-3 mt-2 p-4 bg-background rounded-md border border-border">
          <Label className="mb-1">{t("builder.questions.correctAnswer")}</Label>
          <RadioGroup
            value={correctAnswer || ""}
            onValueChange={(val) =>
              setValue(`questions.${index}.correctAnswer`, val, {
                shouldValidate: true,
              })
            }
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id={`q-${index}-true`} />
              <Label htmlFor={`q-${index}-true`} className="cursor-pointer">
                {t("builder.questions.true")}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id={`q-${index}-false`} />
              <Label htmlFor={`q-${index}-false`} className="cursor-pointer">
                {t("builder.questions.false")}
              </Label>
            </div>
          </RadioGroup>
          {questionErrors?.correctAnswer && (
            <p className="text-xs text-destructive">
              {t("builder.questions.correctAnswerError")}
            </p>
          )}
        </div>
      )}

      {type === "essay" && (
        <div className="p-4 bg-background rounded-md border border-border text-sm text-muted-foreground">
          {t("builder.questions.essayNote")}
        </div>
      )}
    </div>
  );
}
