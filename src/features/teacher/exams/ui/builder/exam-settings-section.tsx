import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import type { ExamBuilderFormData } from "../../types";

export function ExamSettingsSection() {
  const { t } = useTranslation("teacherExams");
  const { watch, setValue } = useFormContext<ExamBuilderFormData>();

  const settings = watch("settings");

  const updateSetting = (key: keyof ExamBuilderFormData["settings"], value: any) => {
    setValue(`settings.${key}`, value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">{t("builder.settings.title")}</h2>
      
      <div className="flex flex-col gap-6">
        
        {/* ── Section: Questions Delivery ── */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("builder.settings.deliveryTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>{t("builder.settings.questionOrder")}</Label>
              <Select
                value={settings.questionOrder}
                onValueChange={(v) => updateSetting("questionOrder", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">{t("builder.settings.orderFixed")}</SelectItem>
                  <SelectItem value="random">{t("builder.settings.orderRandom")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex flex-col gap-1">
                <Label className="text-base">{t("builder.settings.shuffleAnswers")}</Label>
                <span className="text-xs text-muted-foreground">
                  {t("builder.settings.shuffleAnswersDesc")}
                </span>
              </div>
              <Switch
                checked={settings.shuffleAnswers}
                onCheckedChange={(v) => updateSetting("shuffleAnswers", v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Section: Availability & Time ── */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("builder.settings.timeTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>{t("builder.settings.timeBehavior")}</Label>
              <Select
                value={settings.timeBehavior}
                onValueChange={(v) => updateSetting("timeBehavior", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start_on_attempt">{t("builder.settings.timeAttempt")}</SelectItem>
                  <SelectItem value="scheduled">{t("builder.settings.timeScheduled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Section: Grading & Results ── */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("builder.settings.gradingTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>{t("builder.settings.attemptsLogic")}</Label>
              <Select
                value={settings.attemptsLogic}
                onValueChange={(v) => updateSetting("attemptsLogic", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest">{t("builder.settings.logicHighest")}</SelectItem>
                  <SelectItem value="last">{t("builder.settings.logicLast")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t("builder.settings.resultVisibility")}</Label>
              <Select
                value={settings.resultVisibility}
                onValueChange={(v) => updateSetting("resultVisibility", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">{t("builder.settings.visImmediate")}</SelectItem>
                  <SelectItem value="after_submission">{t("builder.settings.visAfterSub")}</SelectItem>
                  <SelectItem value="hide">{t("builder.settings.visHide")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t("builder.settings.essayHandling")}</Label>
              <Select
                value={settings.essayHandling}
                onValueChange={(v) => updateSetting("essayHandling", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wait_manual">{t("builder.settings.essayWait")}</SelectItem>
                  <SelectItem value="publish_without">{t("builder.settings.essayPublish")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
