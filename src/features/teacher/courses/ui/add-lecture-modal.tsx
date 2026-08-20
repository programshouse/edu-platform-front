import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useCourseContentStore } from "../model/course-content-store";
import { toast } from "sonner";

export function AddLectureModal() {
  const { t } = useTranslation("teacherCourses");
  const isOpen = useCourseContentStore((s) => s.isAddLectureModalOpen);
  const editingLecture = useCourseContentStore((s) => s.editingLecture);
  const closeLectureModal = useCourseContentStore((s) => s.closeLectureModal);
  
  const [step, setStep] = useState(1);
  const [type, setType] = useState<"video" | "live">("video");
  
  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setType(editingLecture?.type || "video");
    }
  }, [isOpen, editingLecture]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  
  const handleSave = () => {
    toast.success(editingLecture ? t("lectures.updated", "Lecture updated") : t("lectures.created", "Lecture created"));
    closeLectureModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeLectureModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingLecture ? t("lectures.editTitle", "Edit Lecture") : t("lectures.addTitle", "Add New Lecture")}
          </DialogTitle>
          <div className="flex gap-2 pt-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} 
              />
            ))}
          </div>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label>{t("lectures.formTitle", "Lecture Title")}</Label>
                <Input defaultValue={editingLecture?.title || ""} placeholder={t("lectures.titlePlaceholder", "Enter title...")} />
              </div>
              <div className="space-y-2">
                <Label>{t("lectures.formDesc", "Description")}</Label>
                <Textarea rows={3} placeholder={t("lectures.descPlaceholder", "What is this lecture about?")} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label>{t("lectures.formType", "Lecture Type")}</Label>
                <Select value={type} onValueChange={(val: "video" | "live") => setType(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">{t("lectures.types.video", "Video Recording")}</SelectItem>
                    <SelectItem value="live">{t("lectures.types.live", "Live Session")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === "video" ? (
                <div className="space-y-2 pt-2">
                  <Label>{t("lectures.videoUrl", "Video URL or Upload")}</Label>
                  <Input type="url" placeholder="https://..." />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("lectures.videoHint", "Or upload a file directly")}
                  </p>
                  <Input type="file" accept="video/mp4,video/x-m4v,video/*" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>{t("lectures.liveDate", "Date")}</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("lectures.liveTime", "Time")}</Label>
                    <Input type="time" />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label>{t("lectures.access", "Access Type")}</Label>
                <Select defaultValue="paid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">{t("lectures.accessFree", "Free Preview")}</SelectItem>
                    <SelectItem value="paid">{t("lectures.accessPaid", "Paid (Enrolled only)")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
          <Button variant="ghost" onClick={step === 1 ? closeLectureModal : handleBack}>
            {step === 1 ? t("actions.cancel", "Cancel") : t("actions.back", "Back")}
          </Button>
          <Button onClick={step === 3 ? handleSave : handleNext}>
            {step === 3 ? t("actions.save", "Save") : t("actions.next", "Next")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
