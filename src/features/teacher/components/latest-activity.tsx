import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ClockIcon, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ActivityItem {
  id: string;
  name: string;
  detail: string;
  timeAgo?: string;
  extra?: string;
  status?: "paid" | "pending";
}

const MOCK_SUBSCRIPTIONS: ActivityItem[] = [
  { id: "1", name: "أحمد محمود", detail: "React من الصفر إلى الاحتراف", timeAgo: "10m" },
  { id: "2", name: "مريم علي",   detail: "تصميم واجهات المستخدم",       timeAgo: "45m" },
  { id: "3", name: "خالد إبراهيم", detail: "JavaScript المتقدم",        timeAgo: "2h" },
  { id: "4", name: "سارة حسن",   detail: "Python للمبتدئين",            timeAgo: "5h" },
];

const MOCK_STUDENTS: ActivityItem[] = [
  { id: "1", name: "منى عبدالله", detail: "انضمت للمنصة",  timeAgo: "30m" },
  { id: "2", name: "يوسف كريم",   detail: "انضم للمنصة",   timeAgo: "1h" },
  { id: "3", name: "ريم الشمري",  detail: "انضمت للمنصة",  timeAgo: "3h" },
  { id: "4", name: "أنس نصر",     detail: "انضم للمنصة",   timeAgo: "6h" },
];

const MOCK_PAYMENTS: ActivityItem[] = [
  { id: "1", name: "أحمد محمود", detail: "React من الصفر", extra: "250 ج.م", status: "paid" },
  { id: "2", name: "مريم علي",   detail: "تصميم Figma",    extra: "200 ج.م", status: "paid" },
  { id: "3", name: "خالد إبراهيم", detail: "JavaScript",   extra: "180 ج.م", status: "pending" },
  { id: "4", name: "سارة حسن",   detail: "Python",         extra: "150 ج.م", status: "paid" },
];

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
  showStatus?: boolean;
  linkTo?: string;
}

function ActivityList({ title, items, showStatus, linkTo = "#" }: ActivityListProps) {
  const { t } = useTranslation("teacher");

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("activity.viewAll")}
          <ExternalLinkIcon className="size-3" />
        </Link>
      </div>

      <div className="flex flex-col flex-1">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-5 py-3 hover:bg-blue-50/40 transition-colors",
              idx < items.length - 1 && "border-b border-gray-50"
            )}
          >
            {/* Avatar */}
            <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold", AVATAR_COLORS[idx % 4])}>
              {item.name.slice(0, 1)}
            </div>

            {/* Name + detail */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 truncate">{item.detail}</p>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {showStatus && item.status && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  item.status === "paid"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                )}>
                  {t(`activity.${item.status}`)}
                </span>
              )}
              {item.extra && (
                <span className="text-xs font-semibold text-blue-600">{item.extra}</span>
              )}
              {!showStatus && item.timeAgo && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ClockIcon className="size-3" />
                  <span>{item.timeAgo}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LatestActivity() {
  const { t } = useTranslation("teacher");

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-800 mb-4">{t("activity.title")}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityList title={t("activity.latestSubscriptions")} items={MOCK_SUBSCRIPTIONS} linkTo="/teacher/courses" />
        <ActivityList title={t("activity.latestStudents")}      items={MOCK_STUDENTS}      linkTo="/teacher/students" />
        <ActivityList title={t("activity.latestPayments")}      items={MOCK_PAYMENTS} showStatus linkTo="/teacher/earnings" />
      </div>
    </section>
  );
}
