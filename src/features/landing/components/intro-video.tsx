import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { HeroVideoDialog } from "@/shared/components/ui/hero-video-dialog";

export function IntroVideo() {
  const { t } = useTranslation("landing");

  return (
    <section className="py-12 lg:py-16 bg-linear-to-b from-white to-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side — first */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
              {t("introVideo.badge")}
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              {t("introVideo.title")}
            </h2>
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-6">
              {t("introVideo.titleHighlight")}
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {t("introVideo.subtitle")}
            </p>

            <p className="text-sm text-gray-400">{t("introVideo.caption")}</p>
          </motion.div>

          {/* Video Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/572sxplSoXY"
              thumbnailSrc="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1122&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              thumbnailAlt={t("introVideo.title")}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
