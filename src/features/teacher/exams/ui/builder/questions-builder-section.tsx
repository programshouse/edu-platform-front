import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { QuestionCard } from "./question-card";
import type { ExamBuilderFormData, QuestionType } from "../../types";

export function QuestionsBuilderSection() {
  const { t } = useTranslation("teacherExams");
  const { control, watch } = useFormContext<ExamBuilderFormData>();
  
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");
  const totalGrade = questions?.reduce((sum, q) => sum + (Number(q.points) || 0), 0) || 0;

  const handleAddQuestion = (type: QuestionType) => {
    const baseQuestion = {
      id: `q-${Date.now()}`,
      type,
      text: "",
      points: 1,
    };

    if (type === "mcq") {
      append({
        ...baseQuestion,
        options: [
          { id: `opt-${Date.now()}-1`, text: "" },
          { id: `opt-${Date.now()}-2`, text: "" },
        ],
        correctAnswer: "",
      });
    } else {
      append(baseQuestion);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border bg-muted/20">
        <div>
          <h2 className="text-lg font-semibold">{t("builder.questions.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("builder.questions.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">{t("builder.questions.totalGrade")}</span>
            <span className="text-xl font-bold text-primary">{totalGrade}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="size-4 me-1.5" />
                {t("builder.questions.addBtn")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAddQuestion("mcq")}>
                {t("builder.questions.typeMcq")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddQuestion("tf")}>
                {t("builder.questions.typeTf")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddQuestion("essay")}>
                {t("builder.questions.typeEssay")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* List */}
      <div className="p-6 bg-muted/10 min-h-[300px]">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-2">{t("builder.questions.empty")}</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-4"
                >
                  {fields.map((field, index) => (
                    <QuestionCard
                      key={field.id}
                      id={field.id}
                      index={index}
                      onRemove={remove}
                      // If it's the last added item and empty text, open edit mode initially
                      isNew={index === fields.length - 1 && !questions[index]?.text}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
