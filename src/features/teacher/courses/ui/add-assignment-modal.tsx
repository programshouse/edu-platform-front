import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCourseContentStore } from "../model/course-content-store";
import { toast } from "sonner";

export function AddAssignmentModal() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCourseContentStore((s) => s.isAddAssignmentModalOpen);
  const editingAssignment = useCourseContentStore((s) => s.editingAssignment);
  const closeAssignmentModal = useCourseContentStore((s) => s.closeAssignmentModal);
  
  const handleSave = () => {
    toast.success(editingAssignment ? t("assignments.updated", "Assignment updated") : t("assignments.created", "Assignment created"));
    closeAssignmentModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAssignmentModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingAssignment ? t("assignments.editTitle", "Edit Assignment") : t("assignments.addTitle", "Add New Assignment")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>{t("assignments.formTitle", "Assignment Title")}</Label>
            <Input defaultValue={editingAssignment?.title || ""} placeholder={t("assignments.titlePlaceholder", "Enter title...")} />
          </div>
          <div className="space-y-2">
            <Label>{t("assignments.formDesc", "Instructions / Description")}</Label>
            <Textarea rows={4} placeholder={t("assignments.descPlaceholder", "What should students do?")} />
          </div>
          <div className="space-y-2">
            <Label>{t("assignments.dueDateLabel", "Due Date")}</Label>
            <Input type="date" defaultValue={editingAssignment?.dueDate ? editingAssignment.dueDate.split('T')[0] : ""} />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 w-full">
          <Button variant="ghost" onClick={closeAssignmentModal}>
            {t("actions.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("actions.save", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
