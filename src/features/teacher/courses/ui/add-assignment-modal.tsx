import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCourseContentStore } from "../model/course-content-store";
import { toast } from "sonner";

export function AddAssignmentModal() {
  const { t, i18n } = useTranslation("teacherCourses");
  const isAr = i18n.language.startsWith("ar");

  const isOpen = useCourseContentStore((s) => s.isAddAssignmentModalOpen);
  const editingAssignment = useCourseContentStore((s) => s.editingAssignment);
  const closeAssignmentModal = useCourseContentStore((s) => s.closeAssignmentModal);
  const addAssignment = useCourseContentStore((s) => s.addAssignment);
  const updateAssignment = useCourseContentStore((s) => s.updateAssignment);
  const courseId = useCourseContentStore((s) => s.courseId);

  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalGrade, setTotalGrade] = useState("100");

  useEffect(() => {
    if (isOpen && editingAssignment) {
      setTitleEn(editingAssignment.title_en || editingAssignment.title || "");
      setTitleAr(editingAssignment.title_ar || editingAssignment.title || "");
      setDescription(editingAssignment.description || "");
      setDueDate(
        editingAssignment.dueDate
          ? editingAssignment.dueDate.split("T")[0]
          : ""
      );
      setTotalGrade(String(editingAssignment.totalGrade ?? 100));
    } else if (isOpen) {
      setTitleEn("");
      setTitleAr("");
      setDescription("");
      // Default due date: 7 days from now
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 7);
      setDueDate(defaultDue.toISOString().split("T")[0]);
      setTotalGrade("100");
    }
  }, [isOpen, editingAssignment]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const title = (isAr ? titleAr : titleEn) || titleAr || titleEn;
    if (!title.trim()) {
      toast.error(
        isAr ? "يرجى إدخال عنوان الواجب" : "Please enter an assignment title"
      );
      return;
    }

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        title,
        title_en: titleEn || title,
        title_ar: titleAr || title,
        description,
        dueDate: dueDate || new Date().toISOString(),
        totalGrade: Number(totalGrade) || 100,
      });
      toast.success(t("assignments.updated", "Assignment updated successfully"));
    } else {
      const newAssignment = {
        id: `asg-${Date.now()}`,
        title,
        title_en: titleEn || title,
        title_ar: titleAr || title,
        description,
        dueDate: dueDate || new Date().toISOString(),
        submissionsCount: 0,
        totalGrade: Number(totalGrade) || 100,
        courseId: courseId ?? undefined,
      };
      addAssignment(newAssignment);
      toast.success(t("assignments.created", "Assignment created successfully"));
    }

    closeAssignmentModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAssignmentModal()}>
      <DialogContent className="sm:max-w-[540px]" dir={isAr ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {editingAssignment
              ? t("assignments.editTitle", "Edit Assignment")
              : t("assignments.addTitle", "Add New Assignment")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="py-3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Title (English) *</Label>
              <Input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Chapter 1 Exercises"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">العنوان (بالعربية) *</Label>
              <Input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: تمارين الفصل الأول"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("assignments.formDesc", "Instructions / Description")}
            </Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(
                "assignments.descPlaceholder",
                "What should students do? Mention requirements, submission guidelines, etc."
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {t("assignments.dueDateLabel", "Due Date")}
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {t("assignments.gradeLabel", "Total Grade (Points)")}
              </Label>
              <Input
                type="number"
                min={1}
                max={1000}
                value={totalGrade}
                onChange={(e) => setTotalGrade(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-3 flex justify-end gap-2 w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={closeAssignmentModal}
            >
              {t("actions.cancel", "Cancel")}
            </Button>
            <Button type="submit">
              {editingAssignment
                ? t("actions.save", "Update")
                : t("assignments.add", "Add Assignment")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
