import { useTranslation } from "react-i18next";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const subscriptionData = [
  { month: "jan", subscriptions: 42 },
  { month: "feb", subscriptions: 55 },
  { month: "mar", subscriptions: 38 },
  { month: "apr", subscriptions: 70 },
  { month: "may", subscriptions: 62 },
  { month: "jun", subscriptions: 85 },
  { month: "jul", subscriptions: 90 },
  { month: "aug", subscriptions: 78 },
  { month: "sep", subscriptions: 95 },
  { month: "oct", subscriptions: 110 },
  { month: "nov", subscriptions: 98 },
  { month: "dec", subscriptions: 130 },
];

const enrollmentRateData = [
  { month: "jan", rate: 65 },
  { month: "feb", rate: 72 },
  { month: "mar", rate: 58 },
  { month: "apr", rate: 80 },
  { month: "may", rate: 75 },
  { month: "jun", rate: 88 },
  { month: "jul", rate: 92 },
  { month: "aug", rate: 84 },
  { month: "sep", rate: 91 },
  { month: "oct", rate: 96 },
  { month: "nov", rate: 89 },
  { month: "dec", rate: 97 },
];

/** Shared tooltip style matching the site's card style */
const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontSize: "12px",
};

const axisStyle = { fontSize: 11, fill: "#9ca3af" };

export function PerformanceCharts() {
  const { t } = useTranslation("teacher");

  const monthLabel = (key: string) =>
    t(`performance.months.${key}` as Parameters<typeof t>[0]);

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-800 mb-4">{t("performance.title")}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* New Subscriptions — Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800">{t("performance.newSubscriptions")}</h3>
            <p className="text-xs text-gray-400">{t("performance.subscriptions")} — 2024</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subscriptionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tickFormatter={monthLabel}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(l) => monthLabel(String(l))}
                formatter={(v) => [v, t("performance.subscriptions")]}
              />
              <Bar dataKey="subscriptions" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Rate — Area Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800">{t("performance.enrollmentRate")}</h3>
            <p className="text-xs text-gray-400">{t("performance.rate")} — 2024</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={enrollmentRateData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tickFormatter={monthLabel}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(l) => monthLabel(String(l))}
                formatter={(v) => [`${v}%`, t("performance.enrollmentRate")]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#2563eb"
                fill="url(#rateGrad)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#2563eb" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </section>
  );
}
