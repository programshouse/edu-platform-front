import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Award, Sparkles } from "lucide-react";
import { SignupForm } from "./components/signup-form";

export function SignUpPage() {
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* ─── Branding Panel (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-indigo-600 via-blue-700 to-blue-800">
        {/* Decorative Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 inset-s-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 inset-e-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/3 translate-x-1/3" />
          <div className="absolute top-1/3 inset-e-1/4 w-48 h-48 bg-white/3 rounded-full" />
          {/* Grid dots pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 py-16 w-full">
          {/* Instructor Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10"
          >
            <div className="relative size-56 mx-auto">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face"
                alt="Instructor"
                className="relative size-56 rounded-full object-cover ring-4 ring-white/30 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center max-w-sm"
          >
            <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
              {t("branding.headline")}
            </h2>
            <p className="text-blue-100/80 text-base leading-relaxed">
              {t("branding.description")}
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 space-y-3 w-full max-w-xs"
          >
            {[
              { icon: Sparkles, label: t("branding.feature1") },
              { icon: BookOpen, label: t("branding.feature2") },
              { icon: Award, label: t("branding.feature3") },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15">
                  <feature.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-sm font-medium text-white/90">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Form Panel ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <SignupForm />
      </div>
    </div>
  );
}
