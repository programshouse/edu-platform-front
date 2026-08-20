import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Award,
  Lightbulb,
  Globe,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

const valueIcons = [Award, Lightbulb, Globe, HeartHandshake, Sparkles];
const valueColors = [
  {
    bg: "bg-blue-50",
    icon: "from-blue-500 to-blue-600",
    border: "border-blue-100",
  },
  {
    bg: "bg-amber-50",
    icon: "from-amber-500 to-orange-600",
    border: "border-amber-100",
  },
  {
    bg: "bg-emerald-50",
    icon: "from-emerald-500 to-teal-600",
    border: "border-emerald-100",
  },
  {
    bg: "bg-rose-50",
    icon: "from-rose-500 to-pink-600",
    border: "border-rose-100",
  },
  {
    bg: "bg-indigo-50",
    icon: "from-indigo-500 to-indigo-600",
    border: "border-indigo-100",
  },
];

type ValueItem = {
  title: string;
  description: string;
};

export function ValuesSection() {
  const { t } = useTranslation("about");

  const values = t("values.items", { returnObjects: true }) as ValueItem[];

  return (
    <section className="py-16 lg:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
            {t("values.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {t("values.title")}{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t("values.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const IconComponent = valueIcons[index % valueIcons.length];
            const color = valueColors[index % valueColors.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${color.bg} rounded-2xl border ${color.border} p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl bg-linear-to-br ${color.icon} flex items-center justify-center shadow-lg mb-4`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
