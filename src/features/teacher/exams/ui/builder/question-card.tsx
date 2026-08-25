import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { QuestionEditor } from "./question-editor";
import type { ExamBuilderFormData } from "../../types";

interface QuestionCardProps {
  id: string;
  index: number;
  onRemove: (index: number) => void;
  isNew?: boolean;
}

export function QuestionCard({
  id,
  index,
  onRemove,
  isNew = false,
}: QuestionCardProps) {
  const { t } = useTranslation("teacherExams");
  const { watch } = useFormContext<ExamBuilderFormData>();
  const [isEditing, setIsEditing] = useState(isNew);

  const question = watch(`questions.${index}`);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mcq":
        return t("builder.questions.typeMcq");
      case "tf":
        return t("builder.questions.typeTf");
      case "essay":
        return t("builder.questions.typeEssay");
      default:
        return type;
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group bg-card border rounded-xl overflow-hidden transition-all ${
            snapshot.isDragging
              ? "shadow-lg border-primary ring-1 ring-primary"
              : "border-border shadow-sm"
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            {/* Always render drag handle.
                hello-pangea/dnd requires it even while editing */}
            <div
              {...provided.dragHandleProps}
              className="mt-1 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
            >
              <GripVertical className="size-5" />
            </div>

            {isEditing ? (
              <div className="flex-1">
                <QuestionEditor
                  index={index}
                  onClose={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {t("builder.questions.questionNum", {
                        num: index + 1,
                      })}
                    </Badge>

                    <Badge variant="outline" className="text-xs font-normal">
                      {getTypeLabel(question?.type || "")}
                    </Badge>

                    <span className="text-xs text-muted-foreground font-medium ms-auto">
                      {question?.points || 0}{" "}
                      {t("builder.questions.pts")}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium leading-relaxed break-words line-clamp-2">
                    {question?.text || (
                      <span className="italic text-muted-foreground">
                        {t("builder.questions.emptyText")}
                      </span>
                    )}
                  </h4>
                </div>

                <div className="flex flex-col gap-1 ms-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="size-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
