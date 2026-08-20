import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsSection } from "@/features/landing/components/stats-section";

export function AboutInstructorSection() {
  const { t, i18n } = useTranslation("about");
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-linear-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -inset-e-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -inset-s-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t("cta.title")}{" "}
              <span className="text-blue-200">{t("cta.titleHighlight")}</span>
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {t("cta.button")}
              <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
