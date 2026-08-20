import { useTranslation } from "react-i18next";
import {
  UsersIcon,
  CreditCardIcon,
  DollarSignIcon,
  BookOpenIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  suffix?: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, icon: Icon, suffix, iconBg, iconColor }: StatCardProps) {
  const { t } = useTranslation("teacher");
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className={`flex size-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`size-4 ${iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
        {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
      </div>

      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUpIcon className="size-3.5 text-emerald-500" />
        ) : (
          <TrendingDownIcon className="size-3.5 text-red-400" />
        )}
        <span className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className="text-xs text-gray-400">{t("stats.vsLastMonth")}</span>
      </div>
    </div>
  );
}

export function StatsCards() {
  const { t } = useTranslation("teacher");

  const stats: Omit<StatCardProps, "iconBg" | "iconColor">[] = [
    { title: t("stats.registeredStudents"),  value: "1,284",  change: 12,  icon: UsersIcon },
    { title: t("stats.activeSubscriptions"), value: "847",    change: 8,   icon: CreditCardIcon },
    { title: t("stats.totalEarnings"),       value: "48,350", change: 15,  icon: DollarSignIcon, suffix: t("stats.currency") },
    { title: t("stats.totalCourses"),        value: "12",     change: -2,  icon: BookOpenIcon },
  ];

  const iconStyles = [
    { iconBg: "bg-blue-50",    iconColor: "text-blue-600" },
    { iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { iconBg: "bg-violet-50",  iconColor: "text-violet-600" },
    { iconBg: "bg-amber-50",   iconColor: "text-amber-600" },
  ];

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-800 mb-4">{t("stats.title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} {...iconStyles[i]} />
        ))}
      </div>
    </section>
  );
}
