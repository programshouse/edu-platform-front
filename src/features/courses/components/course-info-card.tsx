import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  CalendarCheck,
  CalendarClock,
  BookOpen,
  ShoppingCart,
  Users,
  BarChart3,
  CreditCard,
} from "lucide-react";

type CourseInfoCardProps = {
  price: number;
  availabilityPeriod: number;
  startDate: string;
  endDate: string;
  lessons: number;
  purchaseSeparately: boolean;
  students: number;
  level: string;
};

export function CourseInfoCard({
  price,
  availabilityPeriod,
  startDate,
  endDate,
  lessons,
  purchaseSeparately,
  students,
  level,
}: CourseInfoCardProps) {
  const { t, i18n } = useTranslation("courses");
  const isRTL = i18n.language === "ar";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const infoItems = [
    {
      icon: DollarSign,
      label: t("details.labels.price"),
      value: `$${price}`,
      highlight: true,
    },
    {
      icon: CalendarClock,
      label: t("details.labels.availabilityPeriod"),
      value: `${availabilityPeriod} ${t("details.labels.months")}`,
    },
    {
      icon: Calendar,
      label: t("details.labels.startDate"),
      value: formatDate(startDate),
    },
    {
      icon: CalendarCheck,
      label: t("details.labels.endDate"),
      value: formatDate(endDate),
    },
    {
      icon: BookOpen,
      label: t("details.labels.numberOfLectures"),
      value: `${lessons} ${t("details.labels.lecturesUnit")}`,
    },
    {
      icon: Users,
      label: t("details.labels.students"),
      value: students.toLocaleString(isRTL ? "ar-EG" : "en-US"),
    },
    {
      icon: BarChart3,
      label: t("details.labels.level"),
      value: t(`card.level.${level}`),
    },
    {
      icon: ShoppingCart,
      label: t("details.labels.purchaseSeparately"),
      value: purchaseSeparately
        ? t("details.labels.yes")
        : t("details.labels.no"),
      valueColor: purchaseSeparately ? "text-emerald-600" : "text-gray-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-blue-100/20 overflow-hidden lg:sticky lg:top-8"
    >
      {/* Price Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          <span className="text-blue-200 text-sm font-medium">USD</span>
        </div>
      </div>

      {/* Info List */}
      <div className="p-5 space-y-0">
        {infoItems.slice(1).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              <item.icon className="w-4.5 h-4.5 text-blue-500" />
              <span>{item.label}</span>
            </div>
            <span
              className={`text-sm font-semibold ${item.valueColor || "text-gray-800"}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="px-5 pb-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full group flex items-center justify-center gap-2.5 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-200 text-base cursor-pointer"
        >
          <CreditCard className="w-5 h-5" />
          {t("details.labels.subscribe")}
        </motion.button>
      </div>
    </motion.div>
  );
}
