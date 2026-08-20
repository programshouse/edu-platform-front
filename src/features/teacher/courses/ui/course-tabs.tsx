import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { LecturesTab } from "./lectures-tab";
import { ExamsTab } from "./exams-tab";
import { AssignmentsTab } from "./assignments-tab";

export function CourseTabs() {
  const { t, i18n } = useTranslation("teacherCourses");

  return (
    <div className="w-full mt-6">
      <Tabs defaultValue="lectures" className="w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <TabsList className="w-full justify-start p-0 mb-6">
          <TabsTrigger
            value="lectures"
            className="data-[state=active]:border-2 data-[state=active]:border-primary/70 hover:border-primary/20 px-2 py-3 font-semibold"
          >
            {t("tabs.lectures", "Lectures")}
          </TabsTrigger>
          <TabsTrigger
            value="exams"
            className="data-[state=active]:border-2 data-[state=active]:border-primary/70 hover:border-primary/20 px-2 py-3 font-semibold"
          >
            {t("tabs.exams", "Exams")}
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="data-[state=active]:border-2 data-[state=active]:border-primary/70 hover:border-primary/20 px-2 py-3 font-semibold"
          >
            {t("tabs.assignments", "Assignments")}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="lectures"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <LecturesTab />
        </TabsContent>

        <TabsContent
          value="exams"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <ExamsTab />
        </TabsContent>

        <TabsContent
          value="assignments"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <AssignmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
