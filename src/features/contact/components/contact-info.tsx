import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const infoCards = [
  {
    key: "email",
    icon: Mail,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    linkPrefix: "mailto:",
  },
  {
    key: "phone",
    icon: Phone,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    linkPrefix: "tel:",
  },
  {
    key: "location",
    icon: MapPin,
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    linkPrefix: "",
  },
];

export function ContactInfo() {
  const { t } = useTranslation("contact");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {t("info.title")}
      </h3>
      <p className="text-gray-500 mb-6">{t("info.subtitle")}</p>

      {infoCards.map((card, index) => {
        const value = t(`info.${card.key}.value`);
        const content = (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bg} border ${card.border} rounded-xl p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div
              className={`w-12 h-12 shrink-0 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {t(`info.${card.key}.label`)}
              </p>
              <p className="text-sm text-gray-700 mt-0.5">{value}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t(`info.${card.key}.description`)}
              </p>
            </div>
          </motion.div>
        );

        if (card.linkPrefix) {
          return (
            <a
              key={card.key}
              href={`${card.linkPrefix}${value.replace(/\s/g, "")}`}
              className="block"
            >
              {content}
            </a>
          );
        }

        return content;
      })}
    </div>
  );
}
