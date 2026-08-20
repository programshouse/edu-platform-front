import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Play, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  const { t, i18n } = useTranslation("landing");
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-white via-blue-50/50 to-blue-100/30 pt-8 pb-20 lg:pt-16 lg:pb-32">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -inset-e-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -inset-s-20 w-60 h-60 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 inset-e-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
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

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
          >
            {t("hero.title")}
            <br />
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 hover:-translate-y-1 transition-all duration-300">
              {t("hero.cta")}
              <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
            <Link
              to="/courses"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Play className="w-5 h-5 text-blue-500" />
              {t("hero.secondaryCta")}
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {[
                "bg-blue-500",
                "bg-green-500",
                "bg-purple-500",
                "bg-orange-500",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center hover:scale-110 transition-all duration-200`}
                >
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
              ))}
              <div
                className={`w-8 h-8 rounded-full bg-blue-500 text-xs text-white border-2 border-white flex items-center justify-center hover:scale-110 transition-all duration-200`}
              >
                +99
              </div>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {t("hero.trustedBy")}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
