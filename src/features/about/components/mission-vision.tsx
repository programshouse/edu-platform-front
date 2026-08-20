import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Target, Eye, Crosshair, Compass } from "lucide-react";

export function MissionVision() {
  const { t } = useTranslation("about");

  const cards = [
    {
      icon: Target,
      title: t("mission.title"),
      description: t("mission.description"),
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      iconBg: "bg-blue-100",
    },
    {
      icon: Eye,
      title: t("vision.title"),
      description: t("vision.description"),
      gradient: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      iconBg: "bg-purple-100",
    },
    {
      icon: Crosshair,
      title: t("goals.title"),
      description: t("goals.description"),
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      iconBg: "bg-emerald-100",
    },
    {
      icon: Compass,
      title: t("approach.title"),
      description: t("approach.description"),
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className={`relative rounded-2xl ${card.bgColor} border ${card.borderColor} p-6 hover:shadow-xl hover:shadow-blue-100/30 hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Decorative glow */}
              <div className="absolute -top-2 -inset-e-2 w-16 h-16 rounded-full bg-white/40 blur-xl" />

              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-lg mb-5`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
