import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";

export function CtaSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-blue-900" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-s-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 inset-e-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t("cta.title")}{" "}
            <span className="text-blue-200">{t("cta.titleHighlight")}</span>
          </h2>

          <p className="text-lg text-blue-100/80 mb-10 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col items-center gap-4">
            <button className="group flex items-center gap-2 px-10 py-4 bg-white text-blue-700 font-bold text-lg rounded-xl shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-1 transition-all duration-300">
              <Sparkles className="w-5 h-5" />
              {t("cta.button")}
            </button>
            <p className="text-sm text-blue-200/60">{t("cta.noCreditCard")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
