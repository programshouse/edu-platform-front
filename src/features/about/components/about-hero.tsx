import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AboutHero() {
  const { t } = useTranslation("about");

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-white via-blue-50/50 to-blue-100/30 py-16 lg:py-24">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -inset-e-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -inset-s-20 w-60 h-60 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 inset-e-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6"
          >
            {t("hero.title")}{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
