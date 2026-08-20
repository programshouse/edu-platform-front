import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/shared/stores/auth-store";
import { TeacherPageLayout } from "./components/teacher-page-layout";
import { StatsCards } from "./components/stats-cards";
import { PerformanceCharts } from "./components/performance-charts";
import { CoursesSummary } from "./components/courses-summary";
import { LatestActivity } from "./components/latest-activity";
import { NotificationsPanel } from "./components/notifications-panel";

export function TeacherDashboardPage() {
  const { t } = useTranslation("teacher");
  const user = useAuthStore((state) => state.user);

  return (
    <TeacherPageLayout
      title={
        <>
          {t("dashboard.welcome")},{" "}
          <span className="text-primary">{user?.name ?? "أستاذ"}</span>
        </>
      }
      subtitle={t("dashboard.subtitle")}
    >
        {/* ── Page content ── */}
        <main className="flex-1 overflow-auto bg-gray-50/60 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <StatsCards />
            <PerformanceCharts />
            <CoursesSummary />
            <LatestActivity />
            <NotificationsPanel />
          </div>
        </main>
    </TeacherPageLayout>
  );
}
